import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// --- HELPERS ---
function generateReferralCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- TYPES ---
interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}

// --- CREATE ORDER FUNCTION ---
export const createOrder = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in.');
  }

  const { items, total, shippingDetails } = request.data;
  const userId = request.auth.uid;

  return await db.runTransaction(async (transaction) => {
    // 1. Validate Stock
    for (const item of items as CartItem[]) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await transaction.get(productRef);
      
      if (!productDoc.exists) {
        throw new functions.https.HttpsError('not-found', `Product ${item.id} not found.`);
      }

      const productData = productDoc.data()!;
      const variant = productData.variants?.find((v: any) => v.id === item.variantId);
      
      if (!variant || variant.stock < item.quantity) {
        throw new functions.https.HttpsError('resource-exhausted', `Insufficient stock for ${productData.name}.`);
      }
    }

    // 2. Adjust Stock
    for (const item of items as CartItem[]) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await transaction.get(productRef);
      const productData = productDoc.data()!;
      const variants = productData.variants.map((v: any) => {
        if (v.id === item.variantId) {
          return { ...v, stock: v.stock - item.quantity };
        }
        return v;
      });

      transaction.update(productRef, { variants, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }

    // 3. Create Order
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderRef = db.collection('orders').doc(orderId);
    
    transaction.set(orderRef, {
      userId,
      items,
      total,
      shippingDetails,
      status: 'Processing',
      paymentStatus: 'Pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const xpAmount = Math.floor(total / 1000) * 100;

    if (xpAmount > 0) {
      await awardXP(userId, xpAmount, db);
    }

    // 4. Clear Cart
    const cartRef = db.collection('carts').doc(userId);
    transaction.update(cartRef, { items: [], updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    return { orderId, success: true };
  });
});

// --- PAYMENT WEBHOOK (MOCK) ---
export const handlePaymentWebhook = functions.https.onRequest(async (req, res) => {
  const { provider, orderId, transactionId, status, amount } = req.body;

  try {
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      res.status(404).send('Order not found');
      return;
    }

    // In a real scenario, verify signature here based on 'provider'
    
    if (status === 'success') {
      await orderRef.update({
        paymentStatus: 'Paid',
        transactionId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Order ${orderId} marked as paid via ${provider}`);
    } else {
       await orderRef.update({
        paymentStatus: 'Failed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Order ${orderId} payment failed via ${provider}`);
    }

    res.status(200).send({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --- USER INITIALIZATION TRIGGER ---
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const referralCode = generateReferralCode();
  const siteUrl = 'https://www.gritapparel.com'; // Should be config driven in production
  
  const userData = {
    email: user.email,
    name: user.displayName || 'Operative',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    loyalty: {
      currentTier: "Foundation",
      totalXP: 0,
      currentTierXP: 0,
      nextTierThreshold: 1000,
      streakDays: 0,
      longestStreak: 0,
      achievements: [],
      challenges: [
        {
          challengeId: "first_blood",
          status: "active",
          progress: 0,
          startedAt: new Date().toISOString()
        }
      ]
    },
    referral: {
      referralCode,
      referralLink: `${siteUrl}/join?ref=${referralCode}`,
      referralsCompleted: 0,
      referralRewards: []
    }
  };

  try {
    await db.collection('users').doc(user.uid).set(userData);
    console.log(`User ${user.uid} initialized with code ${referralCode}`);
  } catch (error) {
    console.error('User initialization error:', error);
  }
});

// --- CLAIM REFERRAL CALLABLE ---
export const claimReferral = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in.');
  }

  const { referralCode } = request.data;
  const referredUid = request.auth.uid;

  if (!referralCode) return { success: false, message: 'No code provided.' };

  // 1. Find the referrer
  const referrersRef = db.collection('users');
  const q = referrersRef.where('referral.referralCode', '==', referralCode).limit(1);
  const snapshot = await q.get();

  if (snapshot.empty) {
    return { success: false, message: 'Invalid referral code.' };
  }

  const referrerDoc = snapshot.docs[0];
  const referrerUid = referrerDoc.id;

  if (referrerUid === referredUid) {
     return { success: false, message: 'Self-referral is prohibited.' };
  }

  // 2. Update referred user and create referral record
  const referredRef = db.collection('users').doc(referredUid);
  
  return await db.runTransaction(async (transaction) => {
    const referredDoc = await transaction.get(referredRef);
    if (!referredDoc.exists) return { success: false, message: 'Infiltration failed.' };
    
    const referredData = referredDoc.data()!;
    if (referredData.referral?.referredBy) {
       return { success: false, message: 'Referral already claimed.' };
    }

    // Link in user doc
    transaction.update(referredRef, {
      'referral.referredBy': referrerUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create record in referrals collection
    const referralId = `${referrerUid}_${referredUid}`;
    const referralRecordRef = db.collection('referrals').doc(referralId);
    
    transaction.set(referralRecordRef, {
      referrerUid,
      referredUid,
      referredEmail: referredData.email,
      status: "registered",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  });
});

// --- LOYALTY HELPERS ---
async function awardXP(uid: string, amount: number, db: admin.firestore.Firestore) {
  const userRef = db.collection('users').doc(uid);
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) return;

    const data = userDoc.data() || {};
    const loyalty = data.loyalty || {
      totalXP: 0,
      currentTier: "Foundation",
      streakDays: 0,
      achievements: []
    };

    const newXP = (loyalty.totalXP || 0) + amount;
    
    // Tier Logic
    let newTier = loyalty.currentTier;
    if (newXP >= 5000) newTier = "Iron Will";
    else if (newXP >= 2500) newTier = "Arena";
    else if (newXP >= 1000) newTier = "Endurance";

    transaction.update(userRef, {
      "loyalty.totalXP": newXP,
      "loyalty.currentTier": newTier,
      "loyalty.updatedAt": admin.firestore.FieldValue.serverTimestamp()
    });

    // Create XP Log
    const logRef = userRef.collection('xpLogs').doc();
    transaction.set(logRef, {
      amount,
      reason: "Mission Completion",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

// --- DAILY STREAK CALLABLE ---
export const claimDailyXP = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Operative identity not verified.');
  
  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);

  return await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) throw new functions.https.HttpsError('not-found', 'Operative profile missing.');

    const profile = userDoc.data() || {};
    const loyalty = profile.loyalty || { totalXP: 0, streakDays: 0, lastCheckIn: null };
    
    const now = new Date();
    const lastCheckIn = loyalty.lastCheckIn ? loyalty.lastCheckIn.toDate() : null;
    
    // Check if already claimed today
    if (lastCheckIn && lastCheckIn.toDateString() === now.toDateString()) {
      throw new functions.https.HttpsError('already-exists', 'Daily XP already secured for this cycle.');
    }

    let newStreak = 1;
    if (lastCheckIn) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastCheckIn.toDateString() === yesterday.toDateString()) {
        newStreak = (loyalty.streakDays || 0) + 1;
      }
    }

    let bonusXP = 50;
    if (newStreak % 7 === 0) bonusXP += 500; // Weekly bonus

    transaction.update(userRef, {
      "loyalty.totalXP": (loyalty.totalXP || 0) + bonusXP,
      "loyalty.streakDays": newStreak,
      "loyalty.lastCheckIn": admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, xpAwarded: bonusXP, streak: newStreak };
  });
});

// --- GIFT CARD HELPERS ---
function generateGiftCardCode() {
  const segment = () => Math.random().toString(36).substr(2, 4).toUpperCase();
  return `GRIT-${segment()}-${segment()}-${segment()}`;
}

// --- GIFT CARD CREATION TRIGGER ---
export const onGiftCardCreated = functions.firestore
  .document('giftCards/{cardId}')
  .onCreate(async (snapshot) => {
    const cardData = snapshot.data();
    if (!cardData) return;

    const code = generateGiftCardCode();
    const expiresAt = admin.firestore.FieldValue.serverTimestamp(); // Would be +12 months in real logic
    
    // 1. Finalize the card record
    await snapshot.ref.update({
      code,
      status: "active",
      balance: cardData.amount,
      expiresAt, // Placeholder logic
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. Trigger Delivery Email (Integration Placeholder)
    // In production, this would use 'Trigger Email' extension or SendGrid
    console.log(`Endurance Credit ${code} generated for ${cardData.recipientEmail}`);
    
    // Create a pending notification for the purchaser (Feature Set 6 Preview)
    const purchaserId = cardData.purchaserUid;
    if (purchaserId) {
      const notificationRef = db.collection('users').doc(purchaserId).collection('notifications').doc();
      await notificationRef.set({
        type: 'system',
        title: 'Gift Card Sent',
        message: `Your endurance gift for ${cardData.recipientName} has been dispatched.`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false
      });
    }
  });

// --- ORDER COMPLETION TRIGGER (REFERRAL & XP) ---
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snapshot) => {
    const orderData = snapshot.data();
    if (!orderData) return;
    
    const userId = orderData.userId;
    const total = orderData.total;
    const userRef = db.collection('users').doc(userId);
    
    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) return;
      
      const userData = userDoc.data()!;
      
      // 1. AWARD XP (100 XP PER 1000 SPENT)
      const earnedXP = Math.floor(total / 1000) * 100;
      if (earnedXP > 0) {
        const currentLoyalty = userData.loyalty || { totalXP: 0, currentTierXP: 0, nextTierThreshold: 1000, currentTier: "Foundation" };
        const newTotalXP = currentLoyalty.totalXP + earnedXP;
        const newTierXP = currentLoyalty.currentTierXP + earnedXP;
        
        // Tier Logic (Simplified for now)
        let newTier = currentLoyalty.currentTier;
        if (newTotalXP >= 15000) newTier = "Iron Will";
        else if (newTotalXP >= 5000) newTier = "Arena";
        else if (newTotalXP >= 1000) newTier = "Endurance";
        
        transaction.update(userRef, {
          'loyalty.totalXP': newTotalXP,
          'loyalty.currentTierXP': newTierXP,
          'loyalty.currentTier': newTier,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Create Notification (Feature Set 6 Preview)
        const notificationRef = db.collection('users').doc(userId).collection('notifications').doc();
        transaction.set(notificationRef, {
          type: 'loyalty',
          title: 'XP Awarded',
          message: `${earnedXP} XP earned for your deployment.`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          read: false
        });
      }

      // 2. REFERRAL COMPLETION
      const referral = userData.referral;
      if (referral && referral.referredBy && referral.referralsCompleted === 0) {
        const referrerId = referral.referredBy;
        const referrerRef = db.collection('users').doc(referrerId);
        const referrerDoc = await transaction.get(referrerRef);
        
        if (referrerDoc.exists) {
          const referrerData = referrerDoc.data()!;
          const rewardId = `REWARD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          const newReward = {
            id: rewardId,
            type: "store-credit",
            amount: 200,
            currency: "BDT",
            earnedAt: new Date().toISOString(),
            used: false,
            orderId: snapshot.id
          };
          
          // Update Referrer
          transaction.update(referrerRef, {
            'referral.referralsCompleted': admin.firestore.FieldValue.increment(1),
            'referral.referralRewards': admin.firestore.FieldValue.arrayUnion(newReward)
          });
          
          // Notify Referrer
          const refNotificationRef = db.collection('users').doc(referrerId).collection('notifications').doc();
          transaction.set(refNotificationRef, {
            type: 'referral',
            title: 'Crew Member Secured',
            message: 'Your crew member made their first deployment. ৳200 credit added to your account.',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false
          });
          
          // Mark this user as completed (prevent double credit)
          transaction.update(userRef, {
             'referral.referralsCompleted': 1 // Indicates first purchase made
          });
        }
      }
      
      return { success: true };
    });
  });
