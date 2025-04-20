import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronDown, ChevronUp, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders, Order } from '../context/OrderContext';

const VendorOrders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByVendor, updateOrderStatus } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && (user.role === 'foodVendor' || user.role === 'laundryVendor')) {
      const vendorOrders = getOrdersByVendor(user.id);
      // Sort orders by date, newest first
      const sortedOrders = [...vendorOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } else {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate, getOrdersByVendor]);
  
  const getPendingOrders = () => {
    return orders.filter(order => order.status === 'pending');
  };
  
  const getProcessingOrders = () => {
    return orders.filter(order => 
      ['confirmed', 'preparing'].includes(order.status)
    );
  };
  
  const getCompletedOrders = () => {
    return orders.filter(order => 
      ['ready', 'delivered', 'cancelled'].includes(order.status)
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
  
  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    // Refresh orders
    if (user) {
      const vendorOrders = getOrdersByVendor(user.id);
      const sortedOrders = [...vendorOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
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
  
  const renderStatusUpdateButtons = (order: Order) => {
    if (order.status === 'pending') {
      return (
        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={() => handleUpdateStatus(order.id, 'confirmed')}
            className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded"
          >
            <Check className="h-4 w-4 mr-1" />
            Accept
          </button>
          <button
            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
            className="flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </button>
        </div>
      );
    } else if (order.status === 'confirmed') {
      return (
        <div className="mt-4">
          <button
            onClick={() => handleUpdateStatus(order.id, 'preparing')}
            className="flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
          >
            Update to Preparing
          </button>
        </div>
      );
    } else if (order.status === 'preparing') {
      return (
        <div className="mt-4">
          <button
            onClick={() => handleUpdateStatus(order.id, 'ready')}
            className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded"
          >
            Mark as Ready for Pickup
          </button>
        </div>
      );
    }
    
    return null;
  };
  
  const pendingOrders = getPendingOrders();
  const processingOrders = getProcessingOrders();
  const completedOrders = getCompletedOrders();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Manage Orders</h1>
        
        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            New Orders ({pendingOrders.length})
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'processing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('processing')}
          >
            Processing ({processingOrders.length})
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'completed'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedOrders.length})
          </button>
        </div>
        
        {/* Orders List */}
        <div className="space-y-4">
          {activeTab === 'pending' && pendingOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No new orders to process</p>
            </div>
          )}
          
          {activeTab === 'processing' && processingOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No orders are currently in progress</p>
            </div>
          )}
          
          {activeTab === 'completed' && completedOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No completed orders to display</p>
            </div>
          )}
          
          {(activeTab === 'pending' 
            ? pendingOrders 
            : activeTab === 'processing' 
              ? processingOrders 
              : completedOrders).map((order) => (
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
                    Customer: {order.userName}
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
                    <div className="mt-4 bg-blue-50 p-3 rounded flex items-start">
                      <ClipboardCheck className="h-5 w-5 text-blue-700 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Pickup Verification Code
                        </p>
                        <p className="text-xs text-blue-600 mb-1">
                          The customer will provide this code during pickup
                        </p>
                        <span className="inline-block px-4 py-1 bg-white border border-blue-200 rounded text-lg font-bold text-blue-900">
                          {order.otp}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {renderStatusUpdateButtons(order)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;