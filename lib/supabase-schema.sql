-- Run this ENTIRE block in Supabase SQL Editor

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Public read" ON shipments;
DROP POLICY IF EXISTS "Public read shipments" ON shipments;
DROP POLICY IF EXISTS "Service all shipments" ON shipments;
DROP POLICY IF EXISTS "Service role all" ON shipments;
DROP POLICY IF EXISTS "Service all clients" ON clients;
DROP POLICY IF EXISTS "Service role clients" ON clients;

-- Create tables if not exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  items JSONB DEFAULT '[]',
  sender JSONB NOT NULL,
  recipient JSONB NOT NULL,
  service TEXT NOT NULL,
  declared_value DECIMAL DEFAULT 0,
  notes TEXT,
  money_details JSONB,
  file_name TEXT,
  images TEXT[] DEFAULT '{}',
  current_location TEXT,
  eta TEXT,
  admin_message JSONB,
  agent_info JSONB,
  is_vip BOOLEAN DEFAULT FALSE,
  client_id TEXT,
  payment JSONB,
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE,
  vip_expires_at TIMESTAMPTZ,
  shipment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Re-enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "anon_read_shipments" ON shipments FOR SELECT TO anon USING (true);
CREATE POLICY "service_all_shipments" ON shipments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_all_clients" ON clients FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_client ON shipments(client_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
