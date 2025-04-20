import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface MenuItem {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_veg: boolean;
  is_available: boolean;
  image_url?: string;
}

interface VendorState {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  fetchMenuItems: (vendorId: string) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  toggleAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export const useVendorStore = create<VendorState>((set, get) => ({
  menuItems: [],
  loading: false,
  error: null,

  fetchMenuItems: async (vendorId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('vendor_id', vendorId);

      if (error) throw error;
      set({ menuItems: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addMenuItem: async (item) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert([item]);

      if (error) throw error;
      await get().fetchMenuItems(item.vendor_id);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateMenuItem: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      const vendorId = get().menuItems.find(item => item.id === id)?.vendor_id;
      if (vendorId) {
        await get().fetchMenuItems(vendorId);
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  toggleAvailability: async (id, isAvailable) => {
    await get().updateMenuItem(id, { is_available: isAvailable });
  },

  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));