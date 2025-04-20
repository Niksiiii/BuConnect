import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { foodVendors, menuItems, MenuItem } from '../data/vendors';
import { useAuth } from '../context/AuthContext';
import { useOrders, OrderItem } from '../context/OrderContext';

const VendorDetail: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [vendor, setVendor] = useState(foodVendors.find(v => v.id === vendorId));
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    if (!vendorId) {
      navigate('/food-vendors');
      return;
    }
    
    const vendorData = foodVendors.find(v => v.id === vendorId);
    if (!vendorData) {
      navigate('/food-vendors');
      return;
    }
    
    setVendor(vendorData);
    
    const vendorMenu = menuItems.filter(item => item.vendorId === vendorId);
    setMenu(vendorMenu);
    
    if (vendorMenu.length > 0) {
      // Set first category as active
      const firstCategory = vendorMenu[0].category;
      setActiveCategory(firstCategory);
    }
  }, [vendorId, navigate]);
  
  useEffect(() => {
    // Calculate total items
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
  }, [cart]);
  
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.foodItemId === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.foodItemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, {
          id: `cart-${Date.now()}`,
          foodItemId: item.id,
          name: item.name,
          price: item.price,
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
  
  const getCategories = () => {
    const categories = Array.from(new Set(menu.map(item => item.category)));
    return categories;
  };
  
  const getMenuByCategory = (category: string) => {
    return menu.filter(item => item.category === category);
  };
  
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    const order = {
      userId: user.id,
      userName: user.fullName || user.enrollmentNumber || '',
      vendorId: vendor?.id || '',
      vendorName: vendor?.name || '',
      items: cart,
      totalAmount: getTotalAmount(),
      status: 'pending' as const,
      orderType: 'food' as const
    };
    
    const newOrder = addOrder(order);
    
    // Clear cart after order
    setCart([]);
    
    // Navigate to order confirmation page
    navigate('/order-confirmation', { state: { order: newOrder } });
  };
  
  if (!vendor) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${vendor.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl w-full mx-auto px-4 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{vendor.name}</h1>
            <p className="text-white text-opacity-90 mb-4">{vendor.description}</p>
            
            <div className="flex items-center text-white text-opacity-90 space-x-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{vendor.openingHours}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{vendor.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Menu */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-10">
              <h3 className="font-bold text-lg text-blue-900 mb-4">Menu Categories</h3>
              <nav className="space-y-2">
                {getCategories().map((category) => (
                  <button
                    key={category}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1">
            {getCategories().map((category) => (
              <div
                key={category}
                id={category}
                className={`mb-10 ${activeCategory === category ? '' : 'hidden lg:block'}`}
              >
                <h2 className="text-2xl font-bold text-blue-900 mb-6">{category}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {getMenuByCategory(category).map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden flex"
                    >
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                          <span className="text-green-700 font-medium">₹{item.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className={`${item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full text-xs`}>
                            {item.isVeg ? 'Veg' : 'Non-veg'}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="font-medium">{totalItems} items</span>
            <span className="ml-2 bg-white text-blue-800 px-2 py-1 rounded-full text-xs">
              ₹{getTotalAmount()}
            </span>
          </button>
        </div>
      )}
      
      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          <div className="w-full max-w-md bg-white h-full shadow-xl z-10 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-900">Your Order</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.location}</p>
              </div>
              
              {cart.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    Continue ordering
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const menuItem = menuItems.find(m => m.id === item.foodItemId);
                              if (menuItem) {
                                addToCart(menuItem);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-green-500"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-800">₹{getTotalAmount()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-gray-800">₹20</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4">
                      <span>Total</span>
                      <span>₹{getTotalAmount() + 20}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;