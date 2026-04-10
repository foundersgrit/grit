import { 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  QueryConstraint,
  collection
} from 'firebase/firestore';
import { db } from './firebase/config';
import { productsRef, journalRef, arenaRef } from './firebase/collections';
import { Product, CategorySlug, JournalEntry, ArenaEntry, Category } from '@/types';

export interface SearchOptions {
  category?: CategorySlug;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-low' | 'price-high' | 'newest';
  searchTerm?: string;
  limitTo?: number;
}

export async function searchProducts(options: SearchOptions = {}): Promise<Product[]> {
  try {
    const constraints: QueryConstraint[] = [];

    if (options.category) {
      constraints.push(where('category', '==', options.category));
    }

    if (options.minPrice !== undefined) {
      constraints.push(where('price', '>=', options.minPrice));
    }

    if (options.maxPrice !== undefined) {
      constraints.push(where('price', '<=', options.maxPrice));
    }

    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      constraints.push(where('searchTerms', 'array-contains', term));
    }

    if (options.sortBy) {
      if (options.sortBy === 'price-low') {
        constraints.push(orderBy('price', 'asc'));
      } else if (options.sortBy === 'price-high') {
        constraints.push(orderBy('price', 'desc'));
      } else if (options.sortBy === 'newest') {
        constraints.push(orderBy('createdAt', 'desc'));
      }
    }

    if (options.limitTo) {
      constraints.push(limit(options.limitTo));
    }

    const q = query(productsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error('Firestore searchProducts error:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(productsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      ...doc.data(),
      id: doc.id
    };
  } catch (error) {
    console.error('Firestore getProductBySlug error:', error);
    return null;
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(query(collection(db, 'categories')));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Category[];
  } catch (error) {
    console.error('Firestore getAllCategories error:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const q = query(collection(db, 'categories'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...doc.data(), id: doc.id } as Category;
  } catch (error) {
    console.error('Firestore getCategoryBySlug error:', error);
    return null;
  }
}

export async function fetchJournalEntries(limitTo?: number): Promise<JournalEntry[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('date', 'desc')];
    if (limitTo) constraints.push(limit(limitTo));
    
    const q = query(journalRef, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error('Firestore fetchJournalEntries error:', error);
    return [];
  }
}

export async function fetchArenaEntries(limitTo?: number): Promise<ArenaEntry[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('date', 'desc')];
    if (limitTo) constraints.push(limit(limitTo));
    
    const q = query(arenaRef, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error('Firestore fetchArenaEntries error:', error);
    return [];
  }
}
