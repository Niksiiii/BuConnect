import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-black text-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-blue-400">Bu</span>connect
            </h3>
            <p className="text-blue-200 text-sm">
              Your all-in-one platform for campus services at Bennett University
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-blue-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/food-vendors" className="text-blue-300 hover:text-white transition-colors">Food Services</a></li>
              <li><a href="/laundry" className="text-blue-300 hover:text-white transition-colors">Laundry Service</a></li>
              <li><a href="/orders" className="text-blue-300 hover:text-white transition-colors">Track Orders</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">Report an Issue</a></li>
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <address className="text-blue-200 text-sm not-italic">
              <p>Bennett University</p>
              <p>Plot No 8-11, TechZone II</p>
              <p>Greater Noida, Uttar Pradesh 201310</p>
              <p className="mt-2">Email: support@buconnect.com</p>
              <p>Phone: +91 1234567890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} Buconnect. All rights reserved.</p>
          <p className="mt-1">A service by Bennett University students, for Bennett University students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;