/*
  # Add Admin Role to Profiles

  1. Changes
    - Add admin flag to profiles table
    - Add admin-specific policies
*/

-- Add admin column to profiles
ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;

-- Update RLS policies for admin access
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));