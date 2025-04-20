import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our orders
export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  vendorId: string;
}

export interface OrderItem {
  id: string;
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface LaundryItem {
  id: string;
  type: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  otp: string;
  orderType: 'food' | 'laundry';
  createdAt: Date;
  laundryItems?: LaundryItem[];
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'otp' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByVendor: (vendorId: string) => Order[];
  getOrdersByUser: (userId: string) => Order[];
  verifyOtp: (orderId: string, otp: string) => boolean;
}

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create a provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Generate a random 4-digit OTP
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'otp' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      otp: generateOtp(),
      createdAt: new Date(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrdersByVendor = (vendorId: string) => {
    return orders.filter(order => order.vendorId === vendorId);
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const verifyOtp = (orderId: string, otp: string) => {
    const order = orders.find(o => o.id === orderId);
    return order?.otp === otp;
  };

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    getOrdersByVendor,
    getOrdersByUser,
    verifyOtp
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

// Create a hook to use the order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};