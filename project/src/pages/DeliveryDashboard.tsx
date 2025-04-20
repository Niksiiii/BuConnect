import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const DeliveryDashboard: React.FC = () => {
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchAvailableOrders();
    fetchMyDeliveries();
    fetchPoints();
  }, [user, navigate]);

  const fetchAvailableOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (full_name, enrollment_number),
        vendors:vendor_id (vendor_name, location)
      `)
      .eq('status', 'ready')
      .is('delivery_requests', null);
    
    if (error) {
      console.error('Error fetching available orders:', error);
      return;
    }
    
    setAvailableOrders(data || []);
  };

  const fetchMyDeliveries = async () => {
    const { data, error } = await supabase
      .from('delivery_requests')
      .select(`
        *,
        orders (
          *,
          users:user_id (full_name, enrollment_number),
          vendors:vendor_id (vendor_name, location)
        )
      `)
      .eq('volunteer_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching my deliveries:', error);
      return;
    }
    
    setMyDeliveries(data || []);
  };

  const fetchPoints = async () => {
    const { data, error } = await supabase
      .from('volunteer_points')
      .select('points')
      .eq('user_id', user?.id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching points:', error);
      return;
    }
    
    setPoints(data?.points || 0);
  };

  const acceptDelivery = async (orderId: string) => {
    const { error } = await supabase
      .from('delivery_requests')
      .insert([
        {
          order_id: orderId,
          volunteer_id: user?.id,
          status: 'accepted'
        }
      ]);
    
    if (error) {
      console.error('Error accepting delivery:', error);
      return;
    }
    
    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'out_for_delivery' })
      .eq('id', orderId);
    
    fetchAvailableOrders();
    fetchMyDeliveries();
  };

  const completeDelivery = async (requestId: string, orderId: string, otp: string) => {
    // Verify OTP
    const { data: orderData } = await supabase
      .from('orders')
      .select('delivery_code')
      .eq('id', orderId)
      .single();
    
    if (orderData?.delivery_code !== otp) {
      alert('Invalid OTP');
      return;
    }
    
    // Update delivery request
    const { error: requestError } = await supabase
      .from('delivery_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    if (requestError) {
      console.error('Error completing delivery:', requestError);
      return;
    }
    
    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', orderId);
    
    // Award points
    const { error: pointsError } = await supabase.rpc('award_delivery_points', {
      user_id: user?.id,
      points_to_add: 50
    });
    
    if (pointsError) {
      console.error('Error awarding points:', pointsError);
    }
    
    fetchMyDeliveries();
    fetchPoints();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Delivery Dashboard</h1>
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <span className="text-blue-800 font-medium">Your Points: {points}</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Available Orders */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Orders</h2>
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-medium text-gray-900">
                        Order #{order.id.split('-')[1]}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        {order.vendors.vendor_name}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      +50 points
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {order.vendors.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Ready for pickup
                    </div>
                  </div>
                  
                  <button
                    onClick={() => acceptDelivery(order.id)}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Accept Delivery
                  </button>
                </div>
              ))}
              
              {availableOrders.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No orders available for delivery</p>
                </div>
              )}
            </div>
          </div>
          
          {/* My Deliveries */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Deliveries</h2>
            <div className="space-y-4">
              {myDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-medium text-gray-900">
                        Order #{delivery.orders.id.split('-')[1]}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        {delivery.orders.vendors.vendor_name}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      delivery.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      Deliver to: {delivery.orders.users.full_name}
                    </div>
                    {delivery.status === 'accepted' && (
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Enter delivery OTP"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          maxLength={4}
                          onChange={(e) => {
                            if (e.target.value.length === 4) {
                              completeDelivery(delivery.id, delivery.orders.id, e.target.value);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {delivery.status === 'completed' && (
                    <div className="mt-4 flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Delivered successfully
                    </div>
                  )}
                </div>
              ))}
              
              {myDeliveries.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">You haven't made any deliveries yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;