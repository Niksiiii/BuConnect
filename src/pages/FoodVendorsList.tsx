import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock } from 'lucide-react';
import { foodVendors, FoodVendor } from '../data/vendors';
import { useAuth } from '../context/AuthContext';

const FoodVendorsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Extract all unique categories from vendors
  const allCategories = Array.from(
    new Set(foodVendors.flatMap(vendor => vendor.categories))
  );

  // Filter vendors based on search term and selected category
  const filteredVendors = foodVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || vendor.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleVendorClick = (vendorId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/vendor/${vendorId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">Campus Food Services</h1>
        <p className="text-lg text-gray-600 mb-10">
          Order from your favorite campus restaurants and food outlets
        </p>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for food places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="md:w-64">
              <select
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {allCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Vendors List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
              onClick={() => handleVendorClick(vendor.id)} 
            />
          ))}
        </div>
        
        {filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500">No food vendors match your search criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface VendorCardProps {
  vendor: FoodVendor;
  onClick: () => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={vendor.imageUrl} 
          alt={vendor.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{vendor.name}</h3>
        <p className="text-gray-600 mb-4">{vendor.description}</p>
        
        <div className="flex items-center text-gray-500 mb-2">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{vendor.openingHours}</span>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{vendor.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {vendor.categories.map((category, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodVendorsList;