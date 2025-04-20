import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import FoodVendorsList from './pages/FoodVendorsList';
import VendorDetail from './pages/VendorDetail';
import LaundryService from './pages/LaundryService';
import OrderConfirmation from './pages/OrderConfirmation';
import StudentOrders from './pages/StudentOrders';
import VendorOrders from './pages/VendorOrders';
import VendorDashboard from './pages/VendorDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/food-vendors" element={<FoodVendorsList />} />
                <Route path="/vendor/:vendorId" element={<VendorDetail />} />
                <Route path="/laundry" element={<LaundryService />} />
                <Route path="/orders" element={<StudentOrders />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/vendor/orders" element={<VendorOrders />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/laundry-orders" element={<VendorOrders />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;