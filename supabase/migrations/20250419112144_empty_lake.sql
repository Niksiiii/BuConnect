/*
  # Initial Schema Setup for Buconnect

  1. New Tables
    - users
      - Stores user information for students, food vendors, and laundry vendors
    - menu_items
      - Stores food items available from vendors
    - orders
      - Stores all orders (food and laundry)
    - delivery_points
      - Tracks points earned by students for deliveries
    - laundry_schedules
      - Manages laundry pickup and drop schedules

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  enrollment_number TEXT UNIQUE,
  course TEXT,
  phone_number TEXT,
  vendor_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'food_vendor', 'laundry_vendor')),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  is_veg BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  vendor_id uuid REFERENCES users(id),
  order_type TEXT NOT NULL CHECK (order_type IN ('food', 'laundry')),
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  delivery_code TEXT,
  delivered_by uuid REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Delivery points table
CREATE TABLE IF NOT EXISTS delivery_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  order_id uuid REFERENCES orders(id),
  points INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Laundry schedules table
CREATE TABLE IF NOT EXISTS laundry_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  drop_date DATE NOT NULL,
  drop_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE laundry_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Menu items policies
CREATE POLICY "Anyone can read menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage own menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = vendor_id);

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = vendor_id OR auth.uid() = delivered_by);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Delivery points policies
CREATE POLICY "Users can read own points"
  ON delivery_points
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Laundry schedules policies
CREATE POLICY "Users can manage own schedules"
  ON laundry_schedules
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);