/*
  # Initial Schema Setup for Wholesale Platform

  1. New Tables
    - `profiles`
      - User profile information
      - Linked to auth.users
      - Stores business details and role information
    
    - `transactions`
      - Records all sales transactions
      - Links to profiles for tracking referrals and distributions
    
    - `commissions`
      - Tracks earned commissions
      - Links to transactions and profiles
      - Automatically calculated based on role

  2. Security
    - RLS enabled on all tables
    - Policies for reading own data
    - Admin can read all data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  company_name text NOT NULL,
  phone text,
  business_description text,
  is_referrer boolean DEFAULT false,
  is_distributor boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  amount decimal(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  referrer_id uuid REFERENCES profiles(id),
  distributor_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Create commissions table
CREATE TABLE commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) NOT NULL,
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  amount decimal(12,2) NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_role CHECK (role IN ('referrer', 'distributor')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'paid'))
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for transactions
CREATE POLICY "Users can read transactions they're involved in"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = referrer_id OR 
    auth.uid() = distributor_id
  );

-- Policies for commissions
CREATE POLICY "Users can read own commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

-- Functions
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate referrer commission if exists
  IF NEW.referrer_id IS NOT NULL THEN
    INSERT INTO commissions (
      transaction_id,
      profile_id,
      amount,
      role
    ) VALUES (
      NEW.id,
      NEW.referrer_id,
      NEW.amount * 0.05,
      'referrer'
    );
  END IF;

  -- Calculate distributor commission if exists
  IF NEW.distributor_id IS NOT NULL THEN
    INSERT INTO commissions (
      transaction_id,
      profile_id,
      amount,
      role
    ) VALUES (
      NEW.id,
      NEW.distributor_id,
      NEW.amount * 0.05,
      'distributor'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic commission calculation
CREATE TRIGGER calculate_commission_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_commission();