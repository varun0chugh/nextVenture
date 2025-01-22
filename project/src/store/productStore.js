import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ products: data || [], loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));