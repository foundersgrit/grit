import { createClient } from '@/utils/supabase/client';
import { Product, CategorySlug, JournalEntry, ArenaEntry, Category } from '@/types';

const supabase = createClient();

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
    let query = supabase
      .from('products')
      .select('*');

    if (options.category) {
      query = query.eq('category_slug', options.category);
    }

    if (options.minPrice !== undefined) {
      query = query.gte('price', options.minPrice);
    }

    if (options.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice);
    }

    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      // Using array_contains mapping if search_terms is defined as TEXT[]
      query = query.contains('search_terms', [term]);
    }

    if (options.sortBy) {
      if (options.sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (options.sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
      } else if (options.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      }
    }

    if (options.limitTo) {
      query = query.limit(options.limitTo);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as Product[];
  } catch (error) {
    console.error('Supabase searchProducts error:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) return null;
    return data as Product;
  } catch (error) {
    console.error('Supabase getProductBySlug error:', error);
    return null;
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Category[];
  } catch (error) {
    console.error('Supabase getAllCategories error:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) return null;
    return data as Category;
  } catch (error) {
    console.error('Supabase getCategoryBySlug error:', error);
    return null;
  }
}

export async function fetchJournalEntries(limitTo?: number): Promise<JournalEntry[]> {
  try {
    let query = supabase
      .from('journal_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (limitTo) query = query.limit(limitTo);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as JournalEntry[];
  } catch (error) {
    console.error('Supabase fetchJournalEntries error:', error);
    return [];
  }
}

export async function fetchArenaEntries(limitTo?: number): Promise<ArenaEntry[]> {
  try {
    let query = supabase
      .from('arena_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (limitTo) query = query.limit(limitTo);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as ArenaEntry[];
  } catch (error) {
    console.error('Supabase fetchArenaEntries error:', error);
    return [];
  }
}
