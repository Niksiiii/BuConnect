import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'foodVendor' | 'laundryVendor'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login({ username, password, role });
      
      // Redirect based on role
      if (role === 'student') {
        navigate('/food-vendors');
      } else if (role === 'foodVendor') {
        navigate('/vendor/orders');
      } else {
        navigate('/vendor/laundry-orders');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-gradient-to-br from-blue-900 to-blue-950 shadow-lg rounded-xl p-8 m-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-blue-300">Login to your Buconnect account</p>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-blue-300 mb-2 text-sm">I am a:</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className={`py-2 px-4 rounded-full text-sm transition-colors focus:outline-none ${
                  role === 'student' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800'
                }`}
                onClick={() => setRole('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded-full text-sm transition-colors focus:outline-none ${
                  role === 'foodVendor' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800'
                }`}
                onClick={() => setRole('foodVendor')}
              >
                Food Vendor
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded-full text-sm transition-colors focus:outline-none ${
                  role === 'laundryVendor' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800'
                }`}
                onClick={() => setRole('laundryVendor')}
              >
                Laundry
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-blue-300 mb-2 text-sm">
              {role === 'student' ? 'Enrollment Number' : 'Username'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={role === 'student' ? 'Enter your enrollment number' : 'Enter your username'}
              required
            />
          </div>
          
          <div>
            <label className="block text-blue-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-800 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-blue-300">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-blue-300">
          Don't have an account?{' '}
          <a 
            href="/signup" 
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;