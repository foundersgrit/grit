import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { auth } from "firebase-functions/v1";
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
export const createOrder = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be signed in.');
  }

  const { items, total, shippingDetails } = request.data;
  const userId = request.auth.uid;

  return await db.runTransaction(async (transaction) => {
    // 1. Validate Stock
    for (const item of items as CartItem[]) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await transaction.get(productRef);
      
      if (!productDoc.exists) {
        throw new HttpsError('not-found', `Product ${item.id} not found.`);
      }

      const productData = productDoc.data()!;
      const variant = productData.variants?.find((v: any) => v.id === item.variantId);
      
      if (!variant || variant.stock < item.quantity) {
        throw new HttpsError('resource-exhausted', `Insufficient stock for ${productData.name}.`);
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
export const handlePaymentWebhook = onRequest(async (req, res) => {
  const { provider, orderId, transactionId, status } = req.body;

  try {
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      res.status(404).send('Order not found');
      return;
    }

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
export const onUserCreate = auth.user().onCreate(async (user) => {
  const referralCode = generateReferralCode();
  const siteUrl = 'https://www.gritapparel.com'; 
  
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
export const claimReferral = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be signed in.');
  }

  const { referralCode } = request.data;
  const referredUid = request.auth.uid;

  if (!referralCode) return { success: false, message: 'No code provided.' };

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

  const referredRef = db.collection('users').doc(referredUid);
  
  return await db.runTransaction(async (transaction) => {
    const referredDoc = await transaction.get(referredRef);
    if (!referredDoc.exists) return { success: false, message: 'Infiltration failed.' };
    
    const referredData = referredDoc.data()!;
    if (referredData.referral?.referredBy) {
       return { success: false, message: 'Referral already claimed.' };
    }

    transaction.update(referredRef, {
      'referral.referredBy': referrerUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

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
    
    let newTier = loyalty.currentTier;
    if (newXP >= 5000) newTier = "Iron Will";
    else if (newXP >= 2500) newTier = "Arena";
    else if (newXP >= 1000) newTier = "Endurance";

    transaction.update(userRef, {
      "loyalty.totalXP": newXP,
      "loyalty.currentTier": newTier,
      "loyalty.updatedAt": admin.firestore.FieldValue.serverTimestamp()
    });

    const logRef = userRef.collection('xpLogs').doc();
    transaction.set(logRef, {
      amount,
      reason: "Mission Completion",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

// --- DAILY STREAK CALLABLE ---
export const claimDailyXP = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Operative identity not verified.');
  
  const uid = request.auth.uid;
  const userRef = db.collection('users').doc(uid);

  return await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) throw new HttpsError('not-found', 'Operative profile missing.');

    const profile = userDoc.data() || {};
    const loyalty = profile.loyalty || { totalXP: 0, streakDays: 0, lastCheckIn: null };
    
    const now = new Date();
    const lastCheckIn = loyalty.lastCheckIn ? loyalty.lastCheckIn.toDate() : null;
    
    if (lastCheckIn && lastCheckIn.toDateString() === now.toDateString()) {
      throw new HttpsError('already-exists', 'Daily XP already secured for this cycle.');
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
    if (newStreak % 7 === 0) bonusXP += 500; 

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
export const onGiftCardCreated = onDocumentCreated('giftCards/{cardId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const cardData = snapshot.data();
    if (!cardData) return;

    const code = generateGiftCardCode();
    const expiresAt = admin.firestore.FieldValue.serverTimestamp(); 
    
    await snapshot.ref.update({
      code,
      status: "active",
      balance: cardData.amount,
      expiresAt, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

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
export const onOrderCreated = onDocumentCreated('orders/{orderId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const orderData = snapshot.data();
    if (!orderData) return;
    
    const userId = orderData.userId;
    const total = orderData.total;
    const userRef = db.collection('users').doc(userId);
    
    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) return;
      
      const userData = userDoc.data()!;
      
      const earnedXP = Math.floor(total / 1000) * 100;
      if (earnedXP > 0) {
        const currentLoyalty = userData.loyalty || { totalXP: 0, currentTierXP: 0, nextTierThreshold: 1000, currentTier: "Foundation" };
        const newTotalXP = currentLoyalty.totalXP + earnedXP;
        const newTierXP = currentLoyalty.currentTierXP + earnedXP;
        
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
        
        const notificationRef = db.collection('users').doc(userId).collection('notifications').doc();
        transaction.set(notificationRef, {
          type: 'loyalty',
          title: 'XP Awarded',
          message: `${earnedXP} XP earned for your deployment.`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          read: false
        });
      }

      const referral = userData.referral;
      if (referral && referral.referredBy && referral.referralsCompleted === 0) {
        const referrerId = referral.referredBy;
        const referrerRef = db.collection('users').doc(referrerId);
        const referrerDoc = await transaction.get(referrerRef);
        
        if (referrerDoc.exists) {
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
          
          transaction.update(referrerRef, {
            'referral.referralsCompleted': admin.firestore.FieldValue.increment(1),
            'referral.referralRewards': admin.firestore.FieldValue.arrayUnion(newReward)
          });
          
          const refNotificationRef = db.collection('users').doc(referrerId).collection('notifications').doc();
          transaction.set(refNotificationRef, {
            type: 'referral',
            title: 'Crew Member Secured',
            message: 'Your crew member made their first deployment. ৳200 credit added to your account.',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false
          });
          
          transaction.update(userRef, {
             'referral.referralsCompleted': 1 
          });
        }
      }
      
      return { success: true };
    });
  });
