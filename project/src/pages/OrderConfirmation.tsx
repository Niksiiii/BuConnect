import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Order } from '../context/OrderContext';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state as { order: Order } || {};
  
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);
  
  if (!order) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Success Banner */}
          <div className="bg-green-600 p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Order Successfully Placed!</h1>
            <p className="text-green-100">
              Your {order.orderType} order has been received and is being processed
            </p>
          </div>
          
          {/* Order Details */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Order #{order.id.split('-')[1]}</h2>
                <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-100 py-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Vendor: {order.vendorName}</p>
                <p>Order Type: {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</p>
                <p>Total Amount: ₹{order.totalAmount}</p>
              </div>
            </div>
            
            {order.orderType === 'food' && order.items.length > 0 ? (
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-800">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-gray-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : order.orderType === 'laundry' && order.laundryItems && order.laundryItems.length > 0 ? (
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Laundry Items</h3>
                <div className="space-y-3">
                  {order.laundryItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-800">{item.type}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-gray-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            
            {/* OTP Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <ClipboardCheck className="h-5 w-5 text-blue-700 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Pickup Verification</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Use this OTP code when collecting your order
                  </p>
                  <div className="flex justify-center">
                    <div className="bg-white px-6 py-3 rounded-lg border border-blue-200">
                      <span className="text-2xl font-bold tracking-widest text-blue-800">
                        {order.otp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                View All Orders
              </button>
              
              <button
                onClick={() => order.orderType === 'food' ? navigate('/food-vendors') : navigate('/laundry')}
                className="flex items-center justify-center w-full py-3 text-blue-600 hover:text-blue-800"
              >
                {order.orderType === 'food' ? 'Order More Food' : 'Place Another Laundry Order'}
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;