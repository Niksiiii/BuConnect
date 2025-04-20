/*
  # Add Delivery System and Update Schema

  1. Updates
    - Add delivery status options to orders
    - Create delivery requests and points tables
    - Add tracking functionality
    - Update laundry pickup timing system

  2. Security
    - Enable RLS on new tables
    - Add appropriate policies
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
  ADD COLUMN IF NOT EXISTS ready_for_pickup TIMESTAMPTZ;

-- Create function to calculate pickup time
CREATE OR REPLACE FUNCTION calculate_pickup_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ready_for_pickup := NEW.created_at + INTERVAL '48 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set pickup time
DROP TRIGGER IF EXISTS set_pickup_time ON laundry_schedules;
CREATE TRIGGER set_pickup_time
  BEFORE INSERT OR UPDATE OF created_at
  ON laundry_schedules
  FOR EACH ROW
  EXECUTE FUNCTION calculate_pickup_time();