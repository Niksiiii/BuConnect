/*
  # Add Delivery System and Update Schema

  1. Updates
    - Remove laundry charges
    - Add delivery system tables
    - Update orders table
    - Add points system

  2. Changes
    - Add delivery_requests table
    - Add volunteer_points table
    - Update orders table with new status options
    - Add delivery tracking
*/

-- Add delivery status to orders
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'rejected', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'));

-- Create delivery requests table
CREATE TABLE IF NOT EXISTS delivery_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  volunteer_id uuid REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  points_awarded INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create volunteer points table
CREATE TABLE IF NOT EXISTS volunteer_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE delivery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_points ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view available delivery requests"
  ON delivery_requests
  FOR SELECT
  TO authenticated
  USING (status = 'pending' OR volunteer_id = auth.uid());

CREATE POLICY "Volunteers can accept delivery requests"
  ON delivery_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = volunteer_id)
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Users can view their points"
  ON volunteer_points
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add tracking fields to orders
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS tracking_updates JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMPTZ;

-- Update laundry schedules
ALTER TABLE laundry_schedules 
  ADD COLUMN IF NOT EXISTS ready_for_pickup TIMESTAMPTZ 
  GENERATED ALWAYS AS (created_at + INTERVAL '48 hours') STORED;