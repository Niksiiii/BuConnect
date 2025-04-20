import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Shirt, Trash2 } from 'lucide-react';
import { laundryItems, LaundryItem } from '../data/vendors';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

interface CartItem extends LaundryItem {
  quantity: number;
}

const MAX_CLOTHES = 10;

const LaundryService: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Calculate total items and amount
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setTotalItems(items);
    setTotalAmount(amount);
  }, [cart]);

  const addToCart = (item: LaundryItem) => {
    if (totalItems >= MAX_CLOTHES) {
      alert(`You can only add up to ${MAX_CLOTHES} clothes`);
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, {
          ...item,
          quantity: 1
        }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Please add items to your cart');
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    const order = {
      userId: user.id,
      userName: user.fullName || user.enrollmentNumber || '',
      vendorId: 'laundry-service',
      vendorName: 'Campus Laundry Service',
      items: [],
      totalAmount: totalAmount,
      status: 'pending' as const,
      orderType: 'laundry' as const,
      laundryItems: cart.map(item => ({
        id: item.id,
        type: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };
    
    const newOrder = addOrder(order);
    
    // Clear cart after order
    setCart([]);
    
    // Navigate to order confirmation page
    navigate('/order-confirmation', { state: { order: newOrder } });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">Campus Laundry Service</h1>
        <p className="text-lg text-gray-600 mb-10">
          Submit your clothes for laundry and get them cleaned and delivered back to you
        </p>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left side - Laundry Items */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Select Clothes</h2>
              <p className="text-gray-600 mb-6">
                You can add up to {MAX_CLOTHES} pieces of clothing ({totalItems}/{MAX_CLOTHES} selected)
              </p>
              
              <div className="space-y-4">
                {laundryItems.map((item) => (
                  <div 
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-4">
                        <Shirt className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">₹{item.price} per piece</p>
                      </div>
                    </div>
                    
                    {cart.find(cartItem => cartItem.id === item.id) ? (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-gray-800 w-5 text-center">
                          {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className={`p-1 focus:outline-none ${
                            totalItems >= MAX_CLOTHES
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          disabled={totalItems >= MAX_CLOTHES}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className={`text-blue-600 hover:text-blue-800 ${
                          totalItems >= MAX_CLOTHES ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={totalItems >= MAX_CLOTHES}
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Laundry Service Information</h2>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 mt-1">
                    <svg className="h-5 w-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Processing Time</h3>
                    <p className="text-sm text-gray-500">Clothes will be ready within 48 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 mt-1">
                    <svg className="h-5 w-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Service Days</h3>
                    <p className="text-sm text-gray-500">Monday to Saturday, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 mt-1">
                    <svg className="h-5 w-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Important Note</h3>
                    <p className="text-sm text-gray-500">Mark your clothes with your name or enrollment number for identification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Cart */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-900">Your Laundry</h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 flex items-center focus:outline-none"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </button>
                )}
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <Shirt className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your laundry bag is empty</p>
                  <p className="text-sm text-gray-400 mt-2">Add clothes to proceed</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                        </div>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 my-4 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total Items</span>
                      <span className="text-gray-800">{totalItems}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none"
                  >
                    Place Laundry Order
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    You'll receive a digital receipt and OTP for pickup
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaundryService;