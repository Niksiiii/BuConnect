// Define the food vendor data for the application

export interface FoodVendor {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categories: string[];
  openingHours: string;
  location: string;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  imageUrl?: string;
}

export const foodVendors: FoodVendor[] = [
  {
    id: 'mblock-mess',
    name: 'M Block Mess',
    description: 'The main campus mess offering a variety of meal options for students',
    imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categories: ['North Indian', 'South Indian', 'Chinese'],
    openingHours: '7:00 AM - 10:00 PM',
    location: 'M Block, Ground Floor'
  },
  {
    id: 'hotspot',
    name: 'Hotspot',
    description: 'Popular hangout spot offering quick bites and refreshments',
    imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categories: ['Fast Food', 'Beverages', 'Snacks'],
    openingHours: '9:00 AM - 11:00 PM',
    location: 'Academic Block, First Floor'
  },
  {
    id: 'quench',
    name: 'Quench',
    description: 'Refreshing beverages and smoothies to quench your thirst',
    imageUrl: 'https://images.pexels.com/photos/616840/pexels-photo-616840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categories: ['Beverages', 'Smoothies', 'Shakes'],
    openingHours: '8:00 AM - 8:00 PM',
    location: 'Sports Complex'
  },
  {
    id: 'kathi',
    name: 'Kathi',
    description: 'Delicious rolls and wraps perfect for on-the-go meals',
    imageUrl: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categories: ['Rolls', 'Wraps', 'Fast Food'],
    openingHours: '11:00 AM - 10:00 PM',
    location: 'Food Court, Second Floor'
  },
  {
    id: 'dominoes',
    name: 'Dominoes',
    description: 'Pizza and pasta options for those craving Italian flavors',
    imageUrl: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categories: ['Pizza', 'Pasta', 'Italian'],
    openingHours: '11:00 AM - 10:00 PM',
    location: 'Food Court, Ground Floor'
  },
  {
    id: 'smapeats',
    name: 'Smapeats',
    description: 'Homestyle meals and comfort food at affordable prices',
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categories: ['Home Style', 'North Indian', 'Thali'],
    openingHours: '9:00 AM - 9:00 PM',
    location: 'D Block, Ground Floor'
  },
  {
    id: 'southern-stories',
    name: 'Southern Stories',
    description: 'Authentic South Indian cuisine offering dosas, idlis, and more',
    imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categories: ['South Indian', 'Dosa', 'Idli'],
    openingHours: '7:30 AM - 9:30 PM',
    location: 'C Block, First Floor'
  }
];

export const menuItems: MenuItem[] = [
  // M Block Mess
  {
    id: 'mm-1',
    vendorId: 'mblock-mess',
    name: 'Veg Thali',
    description: 'Complete meal with roti, rice, dal, sabzi, raita, and salad',
    price: 120,
    category: 'North Indian',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'mm-2',
    vendorId: 'mblock-mess',
    name: 'Non-Veg Thali',
    description: 'Complete meal with roti, rice, dal, chicken curry, and salad',
    price: 150,
    category: 'North Indian',
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'mm-3',
    vendorId: 'mblock-mess',
    name: 'Masala Dosa',
    description: 'Crispy dosa filled with spiced potato filling, served with sambar and chutney',
    price: 80,
    category: 'South Indian',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'mm-4',
    vendorId: 'mblock-mess',
    name: 'Chilli Chicken',
    description: 'Spicy Indo-Chinese style chicken',
    price: 120,
    category: 'Chinese',
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'mm-5',
    vendorId: 'mblock-mess',
    name: 'Veg Fried Rice',
    description: 'Stir-fried rice with mixed vegetables',
    price: 90,
    category: 'Chinese',
    isVeg: true,
    isAvailable: true
  },

  // Hotspot
  {
    id: 'hs-1',
    vendorId: 'hotspot',
    name: 'Veg Burger',
    description: 'Crispy veg patty with fresh vegetables and special sauce',
    price: 70,
    category: 'Fast Food',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'hs-2',
    vendorId: 'hotspot',
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with lettuce, cheese, and mayo',
    price: 90,
    category: 'Fast Food',
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'hs-3',
    vendorId: 'hotspot',
    name: 'French Fries',
    description: 'Crispy golden fries with seasoning',
    price: 60,
    category: 'Snacks',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'hs-4',
    vendorId: 'hotspot',
    name: 'Cold Coffee',
    description: 'Refreshing cold coffee with ice cream',
    price: 80,
    category: 'Beverages',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'hs-5',
    vendorId: 'hotspot',
    name: 'Nachos',
    description: 'Crispy nachos with cheese sauce and salsa',
    price: 100,
    category: 'Snacks',
    isVeg: true,
    isAvailable: true
  },

  // Quench
  {
    id: 'qu-1',
    vendorId: 'quench',
    name: 'Fresh Fruit Juice',
    description: 'Choice of seasonal fruits blended fresh',
    price: 60,
    category: 'Beverages',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'qu-2',
    vendorId: 'quench',
    name: 'Chocolate Shake',
    description: 'Rich chocolate shake with ice cream',
    price: 90,
    category: 'Shakes',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'qu-3',
    vendorId: 'quench',
    name: 'Mixed Fruit Smoothie',
    description: 'Blend of seasonal fruits with yogurt',
    price: 100,
    category: 'Smoothies',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'qu-4',
    vendorId: 'quench',
    name: 'Oreo Shake',
    description: 'Creamy milkshake with Oreo cookies',
    price: 110,
    category: 'Shakes',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'qu-5',
    vendorId: 'quench',
    name: 'Green Detox Juice',
    description: 'Healthy blend of spinach, cucumber, apple, and mint',
    price: 80,
    category: 'Beverages',
    isVeg: true,
    isAvailable: true
  },
  
  // Kathi
  {
    id: 'kt-1',
    vendorId: 'kathi',
    name: 'Paneer Kathi Roll',
    description: 'Flavorful paneer with spices wrapped in a paratha',
    price: 90,
    category: 'Rolls',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'kt-2',
    vendorId: 'kathi',
    name: 'Chicken Kathi Roll',
    description: 'Spicy chicken filling wrapped in a paratha',
    price: 110,
    category: 'Rolls',
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'kt-3',
    vendorId: 'kathi',
    name: 'Egg Roll',
    description: 'Egg omelet with vegetables wrapped in a paratha',
    price: 80,
    category: 'Rolls',
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'kt-4',
    vendorId: 'kathi',
    name: 'Aloo Tikki Wrap',
    description: 'Potato patty with chutneys in a wheat wrap',
    price: 70,
    category: 'Wraps',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'kt-5',
    vendorId: 'kathi',
    name: 'Noodle Roll',
    description: 'Hakka noodles wrapped in a paratha',
    price: 100,
    category: 'Rolls',
    isVeg: true,
    isAvailable: true
  },

  // Dominoes
  {
    id: 'dm-1',
    vendorId: 'dominoes',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 180,
    category: 'Pizza',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'dm-2',
    vendorId: 'dominoes',
    name: 'Chicken Supreme Pizza',
    description: 'Topped with chicken, bell peppers, onions, and olives',
    price: 250,
    category: 'Pizza',
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'dm-3',
    vendorId: 'dominoes',
    name: 'Pasta Alfredo',
    description: 'Creamy white sauce pasta with vegetables',
    price: 160,
    category: 'Pasta',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'dm-4',
    vendorId: 'dominoes',
    name: 'Garlic Breadsticks',
    description: 'Freshly baked breadsticks with garlic butter and dip',
    price: 120,
    category: 'Italian',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'dm-5',
    vendorId: 'dominoes',
    name: 'Pasta Arrabiata',
    description: 'Spicy tomato sauce pasta with herbs',
    price: 150,
    category: 'Pasta',
    isVeg: true,
    isAvailable: true
  },

  // Smapeats
  {
    id: 'sm-1',
    vendorId: 'smapeats',
    name: 'Rajma Chawal',
    description: 'Classic kidney beans curry with steamed rice',
    price: 90,
    category: 'North Indian',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'sm-2',
    vendorId: 'smapeats',
    name: 'Special Thali',
    description: 'Deluxe thali with 3 sabzis, dal, rice, 3 rotis, raita, and dessert',
    price: 150,
    category: 'Thali',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'sm-3',
    vendorId: 'smapeats',
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry with fried bread',
    price: 100,
    category: 'North Indian',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'sm-4',
    vendorId: 'smapeats',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese in rich tomato and butter gravy',
    price: 120,
    category: 'North Indian',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'sm-5',
    vendorId: 'smapeats',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils with butter and cream',
    price: 100,
    category: 'North Indian',
    isVeg: true,
    isAvailable: true
  },

  // Southern Stories
  {
    id: 'ss-1',
    vendorId: 'southern-stories',
    name: 'Plain Dosa',
    description: 'Crispy rice and lentil crepe served with sambar and chutney',
    price: 70,
    category: 'Dosa',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'ss-2',
    vendorId: 'southern-stories',
    name: 'Idli Sambar',
    description: '4 pieces of steamed rice cakes with sambar and chutney',
    price: 60,
    category: 'Idli',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'ss-3',
    vendorId: 'southern-stories',
    name: 'Mysore Masala Dosa',
    description: 'Dosa with spicy red chutney and potato filling',
    price: 100,
    category: 'Dosa',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'ss-4',
    vendorId: 'southern-stories',
    name: 'Rava Onion Uttapam',
    description: 'Semolina pancake topped with onions and vegetables',
    price: 90,
    category: 'South Indian',
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'ss-5',
    vendorId: 'southern-stories',
    name: 'Vada Sambar',
    description: '2 pieces of crispy lentil donuts with sambar and chutney',
    price: 70,
    category: 'South Indian',
    isVeg: true,
    isAvailable: true
  }
];

// Laundry service data
export interface LaundryItem {
  id: string;
  name: string;
  price: number;
}

export const laundryItems: LaundryItem[] = [
  { id: 'shirt', name: 'Shirt', price: 20 },
  { id: 'tshirt', name: 'T-shirt', price: 15 },
  { id: 'pant', name: 'Pant', price: 25 },
  { id: 'lower', name: 'Lower', price: 20 },
  { id: 'trouser', name: 'Trouser', price: 25 },
  { id: 'dupatta', name: 'Dupatta', price: 15 },
  { id: 'kurti', name: 'Kurti', price: 30 },
  { id: 'bedsheet', name: 'Bedsheet', price: 40 },
  { id: 'pillow-cover', name: 'Pillow Cover', price: 10 }
];