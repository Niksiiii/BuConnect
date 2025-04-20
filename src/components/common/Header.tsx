import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/login', label: 'Login' },
        { to: '/signup', label: 'Sign Up' }
      ];
    }

    if (user?.role === 'student') {
      return [
        { to: '/food-vendors', label: 'Food Services' },
        { to: '/laundry', label: 'Laundry Service' },
        { to: '/orders', label: 'My Orders' }
      ];
    } else if (user?.role === 'foodVendor') {
      return [
        { to: '/vendor/orders', label: 'Orders' },
        { to: '/vendor/menu', label: 'Menu Management' }
      ];
    } else if (user?.role === 'laundryVendor') {
      return [
        { to: '/vendor/laundry-orders', label: 'Laundry Orders' }
      ];
    }

    return [];
  };

  const links = getNavLinks();

  return (
    <header className="bg-gradient-to-r from-blue-900 to-black text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center hover:text-blue-300 transition-colors duration-200"
          >
            <span className="mr-2 text-blue-500">Bu</span>connect
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link, index) => (
            <Link 
              key={index} 
              to={link.to} 
              className="hover:text-blue-300 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="flex items-center text-white hover:text-blue-300 transition-colors duration-200"
              >
                <LogOut size={18} className="mr-1" />
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gradient-to-r from-blue-900 to-black mt-2 py-4 px-6 space-y-3">
          {links.map((link, index) => (
            <Link 
              key={index} 
              to={link.to} 
              className="block py-2 hover:text-blue-300 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated && (
            <button 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center py-2 text-white hover:text-blue-300 transition-colors duration-200"
            >
              <LogOut size={18} className="mr-1" />
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;