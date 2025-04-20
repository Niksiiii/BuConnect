import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders, Order } from '../context/OrderContext';

const StudentOrders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByUser, verifyOtp } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});
  const [otpErrors, setOtpErrors] = useState<{ [key: string]: string }>({});
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      const userOrders = getOrdersByUser(user.id);
      // Sort orders by date, newest first
      const sortedOrders = [...userOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    }
  }, [user, isAuthenticated, navigate, getOrdersByUser]);
  
  const getActiveOrders = () => {
    return orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
    );
  };
  
  const getCompletedOrders = () => {
    return orders.filter(order => 
      ['delivered', 'cancelled'].includes(order.status)
    );
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  
  const handleOtpVerify = (orderId: string) => {
    const otp = otpInput[orderId];
    
    if (!otp || otp.length !== 4) {
      setOtpErrors({
        ...otpErrors,
        [orderId]: 'Please enter a valid 4-digit OTP'
      });
      return;
    }
    
    const isValid = verifyOtp(orderId, otp);
    
    if (isValid) {
      // In a real app, this would update the order status to delivered
      alert('OTP verified successfully! Your order has been delivered.');
      setOtpErrors({
        ...otpErrors,
        [orderId]: ''
      });
    } else {
      setOtpErrors({
        ...otpErrors,
        [orderId]: 'Invalid OTP. Please try again.'
      });
    }
  };
  
  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderOrderItems = (order: Order) => {
    if (order.orderType === 'food' && order.items.length > 0) {
      return (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Order Items:</h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} x{item.quantity}</span>
              <span className="text-gray-800">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      );
    } else if (order.orderType === 'laundry' && order.laundryItems && order.laundryItems.length > 0) {
      return (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Laundry Items:</h4>
          {order.laundryItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.type} x{item.quantity}</span>
              <span className="text-gray-800">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  const activeOrders = getActiveOrders();
  const completedOrders = getCompletedOrders();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">My Orders</h1>
        
        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-200">
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'active'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'completed'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Orders ({completedOrders.length})
          </button>
        </div>
        
        {/* Orders List */}
        <div className="space-y-4">
          {activeTab === 'active' && activeOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You don't have any active orders</p>
              <button
                onClick={() => navigate('/food-vendors')}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Place an order
              </button>
            </div>
          )}
          
          {activeTab === 'completed' && completedOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You don't have any completed orders yet</p>
            </div>
          )}
          
          {(activeTab === 'active' ? activeOrders : completedOrders).map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">
                      Order #{order.id.split('-')[1]}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  {expandedOrderId === order.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {order.orderType === 'food' ? 'Food Order' : 'Laundry'}
                  </span>
                  <span className="text-sm font-medium">
                    {order.vendorName}
                  </span>
                </div>
              </div>
              
              {expandedOrderId === order.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  {renderOrderItems(order)}
                  
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="font-medium">₹{order.totalAmount}</span>
                  </div>
                  
                  {order.status === 'ready' && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Pickup Verification:</h4>
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Enter 4-digit OTP"
                          className="px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                          maxLength={4}
                          value={otpInput[order.id] || ''}
                          onChange={(e) => {
                            setOtpInput({
                              ...otpInput,
                              [order.id]: e.target.value
                            });
                          }}
                        />
                        <button
                          onClick={() => handleOtpVerify(order.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
                        >
                          Verify
                        </button>
                      </div>
                      {otpErrors[order.id] && (
                        <p className="text-red-500 text-xs mt-1">{otpErrors[order.id]}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Show this OTP to the vendor at the time of pickup
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentOrders;