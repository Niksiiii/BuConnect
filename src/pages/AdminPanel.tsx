import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'settings'>('users');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchUsers();
    fetchOrders();
  }, [user, navigate]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    
    setUsers(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (full_name, enrollment_number),
        vendors:vendor_id (vendor_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }
    
    setOrders(data || []);
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ is_active: !isActive })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user status:', error);
      return;
    }
    
    fetchUsers();
  };

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name || user.vendor_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => toggleUserStatus(user.id, user.is_active)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      user.is_active
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-900">
                  Order #{order.id.split('-')[1]}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
              {expandedId === order.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                order.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          
          {expandedId === order.id && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="mt-4 space-y-2">
                <p><span className="font-medium">Customer:</span> {order.users.full_name}</p>
                <p><span className="font-medium">Vendor:</span> {order.vendors.vendor_name}</p>
                <p><span className="font-medium">Order Type:</span> {order.order_type}</p>
                <p><span className="font-medium">Total Amount:</span> ₹{order.total_amount}</p>
                
                {order.tracking_updates && order.tracking_updates.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Tracking Updates</h4>
                    <div className="space-y-2">
                      {order.tracking_updates.map((update: any, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="text-gray-500">{new Date(update.timestamp).toLocaleString()}</span>
                          <span className="ml-2">{update.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Points</h4>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Points per delivery"
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Order Timeout</h4>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Minutes until order expires"
          />
        </div>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Admin Dashboard</h1>
        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Users
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Orders
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </button>
        </div>
        
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminPanel;