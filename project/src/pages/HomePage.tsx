import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Shirt, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-black text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-blue-400">Bu</span>connect
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-200 max-w-3xl mx-auto">
            Your all-in-one platform for campus services at Bennett University
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-300 text-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-transparent hover:bg-blue-800/50 border border-blue-500 text-white rounded-full font-medium transition-colors duration-300 text-lg"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-900">
            Campus Services at Your Fingertips
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Food Service */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="p-4 bg-blue-100 inline-block rounded-full mb-6">
                <ShoppingBag className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Food Delivery</h3>
              <p className="text-gray-600 mb-6">
                Order from your favorite campus eateries right to your room. Choose from multiple vendors and cuisines.
              </p>
              <button
                onClick={() => navigate('/food-vendors')}
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                Explore Food Options
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            {/* Laundry Service */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="p-4 bg-blue-100 inline-block rounded-full mb-6">
                <Shirt className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Laundry Service</h3>
              <p className="text-gray-600 mb-6">
                Schedule laundry pickups and get your clothes cleaned and delivered back to you. Track your orders easily.
              </p>
              <button
                onClick={() => navigate('/laundry')}
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                Try Laundry Service
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            {/* Account Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="p-4 bg-blue-100 inline-block rounded-full mb-6">
                <User className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Student Account</h3>
              <p className="text-gray-600 mb-6">
                Manage your profile, track orders, and get updates on your services in one convenient dashboard.
              </p>
              <button
                onClick={() => navigate(isAuthenticated ? '/orders' : '/login')}
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                {isAuthenticated ? 'View Your Orders' : 'Sign In to Account'}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How Buconnect Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="relative">
              <div className="bg-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-blue-200">Sign up with your Bennett University credentials to access all services</p>
              
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-blue-700 -z-0 transform -translate-x-8"></div>
            </div>
            
            <div className="relative">
              <div className="bg-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Service</h3>
              <p className="text-blue-200">Select from food delivery or laundry services based on your needs</p>
              
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-blue-700 -z-0 transform -translate-x-8"></div>
            </div>
            
            <div className="relative">
              <div className="bg-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Place Order</h3>
              <p className="text-blue-200">Add items to your cart, specify requirements, and submit your order</p>
              
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-blue-700 -z-0 transform -translate-x-8"></div>
            </div>
            
            <div>
              <div className="bg-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track & Receive</h3>
              <p className="text-blue-200">Get real-time updates and receive your order with secure OTP verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Info Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 p-8 md:p-12 rounded-2xl shadow-sm">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Why Students Love Buconnect</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-800 font-bold">RS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rahul Singh</h4>
                    <p className="text-sm text-gray-500">B.Tech CSE</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The food delivery is super convenient. I can order late night snacks while studying for exams!"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-800 font-bold">AM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Ananya Mehta</h4>
                    <p className="text-sm text-gray-500">BBA</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The laundry service is a lifesaver. I never have to worry about washing clothes anymore!"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-800 font-bold">VP</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Veer Patel</h4>
                    <p className="text-sm text-gray-500">B.Tech Mechanical</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Tracking my orders is so easy. I know exactly when my food will arrive or when my laundry is ready."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Campus Life?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Join thousands of Bennett University students already using Buconnect
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-300 text-lg"
            >
              Create Your Account Now
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/food-vendors')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-300 text-lg"
            >
              Place an Order
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;