import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (products: { id: string; quantity: number; price: number }[]) => Promise<void>;
  fetchOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  createOrder: async (products) => {
    set({ loading: true });
    try {
      const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ total_amount: totalAmount }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = products.map((product) => ({
        order_id: order.id,
        product_id: product.id,
        quantity: product.quantity,
        price_at_time: product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await get().fetchOrders();
      set({ loading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ orders: data || [], loading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));