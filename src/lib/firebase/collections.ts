import { 
  collection, 
  CollectionReference, 
  DocumentData, 
  doc 
} from 'firebase/firestore';
import { db } from './config';
import { Product, JournalEntry, ArenaEntry, Order, Cart, UserProfile } from '@/types';

// Helper to cast a collection with types
const createCollection = <T = DocumentData>(path: string) => {
  return collection(db, path) as CollectionReference<T>;
};

// Collection references
export const productsRef = createCollection<Product>('products');
export const journalRef = createCollection<JournalEntry>('journal');
export const arenaRef = createCollection<ArenaEntry>('arena');
export const ordersRef = createCollection<Order>('orders');
export const cartsRef = createCollection<Cart>('carts');
export const usersRef = createCollection<UserProfile>('users');
export const reviewsRef = createCollection<any>('reviews');

// Document helpers
export const userDocRef = (uid: string) => doc(db, 'users', uid);
export const userWishlistRef = (uid: string) => collection(db, 'users', uid, 'wishlist');
export const userNotificationsRef = (uid: string) => collection(db, 'users', uid, 'notifications');
export const orderTimelineRef = (orderId: string) => collection(db, 'orders', orderId, 'timeline');
