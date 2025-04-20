import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupForm: React.FC = () => {
  const [role, setRole] = useState<'student' | 'foodVendor' | 'laundryVendor'>('student');
  const [formData, setFormData] = useState({
    fullName: '',
    enrollmentNumber: '',
    course: '',
    phoneNumber: '',
    bennettId: '',
    vendorName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (role === 'student') {
      if (!formData.fullName || !formData.enrollmentNumber || !formData.course || 
          !formData.phoneNumber || !formData.bennettId || !formData.password) {
        setError('Please fill in all fields');
        return false;
      }
      
      // Validate phone number format
      if (!/^\d{10}$/.test(formData.phoneNumber)) {
        setError('Please enter a valid 10-digit phone number');
        return false;
      }
    } else {
      if (!formData.vendorName || !formData.password) {
        setError('Please fill in all fields');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await signup({
        fullName: formData.fullName,
        enrollmentNumber: formData.enrollmentNumber,
        course: formData.course,
        phoneNumber: formData.phoneNumber,
        bennettId: formData.bennettId,
        vendorName: formData.vendorName,
        password: formData.password,
        role
      });
      
      // Redirect based on role
      if (role === 'student') {
        navigate('/food-vendors');
      } else if (role === 'foodVendor') {
        navigate('/vendor/orders');
      } else {
        navigate('/vendor/laundry-orders');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const courseOptions = [
    'B.Tech Computer Science',
    'B.Tech Electronics',
    'B.Tech Mechanical',
    'BBA',
    'MBA',
    'B.A. Media Studies',
    'B.Sc. Computer Science',
    'Law',
    'Ph.D'
  ];

  return (
    <div className="max-w-md w-full bg-gradient-to-br from-blue-900 to-blue-950 shadow-lg rounded-xl p-8 m-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-blue-300">Join Buconnect to access campus services</p>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
        
        {role === 'student' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-blue-300 mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-blue-300 mb-2 text-sm">Enrollment Number</label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g., E2021CSEXXX"
                required
              />
            </div>
            
            <div>
              <label className="block text-blue-300 mb-2 text-sm">Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select your course</option>
                {courseOptions.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-blue-300 mb-2 text-sm">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10-digit mobile number"
                required
              />
            </div>
            
            <div>
              <label className="block text-blue-300 mb-2 text-sm">Bennett Email ID</label>
              <input
                type="email"
                name="bennettId"
                value={formData.bennettId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.name@bennett.edu.in"
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-blue-300 mb-2 text-sm">Vendor Name</label>
            <input
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your business name"
              required
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-blue-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
              required
            />
          </div>
          
          <div>
            <label className="block text-blue-300 mb-2 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-blue-950 border border-blue-800 text-white placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-blue-300">
          Already have an account?{' '}
          <a 
            href="/login" 
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;