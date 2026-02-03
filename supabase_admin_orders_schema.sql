-- =====================================================
-- ADMIN ORDER MANAGEMENT SYSTEM - DATABASE SCHEMA (FIXED)
-- Production-grade order management following Flipkart architecture
-- =====================================================

-- =====================================================
-- 0. CREATE ADMINS TABLE
-- =====================================================

-- Create admins table to track admin users
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins can view all admins
CREATE POLICY "Admins can view all admins"
    ON admins FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
        )
    );

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admins WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 1. ENHANCE ORDERS TABLE
-- =====================================================

-- Add new columns to existing orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sla_breach BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'web' CHECK (source IN ('web', 'mobile', 'api')),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add index for admin queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_to ON orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_orders_risk_score ON orders(risk_score);

-- =====================================================
-- 2. ORDER STATUS HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_by_type TEXT DEFAULT 'system' CHECK (changed_by_type IN ('admin', 'system', 'customer')),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- RLS Policies
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all status history"
    ON order_status_history FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their order status history"
    ON order_status_history FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_status_history.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert status history"
    ON order_status_history FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- =====================================================
-- 3. SHIPMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    courier_name TEXT NOT NULL,
    tracking_id TEXT,
    awb_number TEXT,
    pickup_date TIMESTAMP WITH TIME ZONE,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    current_location TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

-- RLS Policies
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all shipments"
    ON shipments FOR ALL
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their shipments"
    ON shipments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = shipments.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_shipments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shipments_updated_at ON shipments;
CREATE TRIGGER shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_shipments_updated_at();

-- =====================================================
-- 4. ORDER NOTES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS order_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_notes_order_id ON order_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_order_notes_created_at ON order_notes(created_at DESC);

-- RLS Policies
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all notes"
    ON order_notes FOR ALL
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Users can view non-internal notes"
    ON order_notes FOR SELECT
    TO authenticated
    USING (
        NOT is_internal
        AND EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_notes.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- =====================================================
-- 5. RPC FUNCTIONS
-- =====================================================

-- Function: Update Order Status with validation and logging
CREATE OR REPLACE FUNCTION update_order_status(
    p_order_id UUID,
    p_new_status TEXT,
    p_reason TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
    v_old_status TEXT;
    v_user_id UUID;
    v_result JSONB;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Check if user is admin
    IF NOT is_admin(v_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Unauthorized: Only admins can update order status'
        );
    END IF;
    
    -- Get current status
    SELECT status INTO v_old_status FROM orders WHERE id = p_order_id;
    
    IF v_old_status IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Order not found'
        );
    END IF;
    
    -- Validate state transition (basic validation)
    IF v_old_status = p_new_status THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Order is already in this status'
        );
    END IF;
    
    -- Update order status
    UPDATE orders
    SET status = p_new_status,
        updated_at = NOW()
    WHERE id = p_order_id;
    
    -- Log status change in history
    INSERT INTO order_status_history (
        order_id,
        old_status,
        new_status,
        changed_by,
        changed_by_type,
        reason,
        metadata
    ) VALUES (
        p_order_id,
        v_old_status,
        p_new_status,
        v_user_id,
        'admin',
        p_reason,
        p_metadata
    );
    
    -- Also log in order_timeline for customer view
    INSERT INTO order_timeline (order_id, status, message)
    VALUES (
        p_order_id,
        p_new_status,
        CASE p_new_status
            WHEN 'confirmed' THEN 'Order confirmed and being processed'
            WHEN 'processing' THEN 'Order is being prepared for shipment'
            WHEN 'packed' THEN 'Order has been packed'
            WHEN 'shipped' THEN 'Order has been shipped'
            WHEN 'out_for_delivery' THEN 'Order is out for delivery'
            WHEN 'delivered' THEN 'Order has been delivered'
            WHEN 'cancelled' THEN 'Order has been cancelled'
            ELSE 'Order status updated'
        END
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'old_status', v_old_status,
        'new_status', p_new_status
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Assign Courier to Order
CREATE OR REPLACE FUNCTION assign_courier(
    p_order_id UUID,
    p_courier_name TEXT,
    p_tracking_id TEXT DEFAULT NULL,
    p_awb_number TEXT DEFAULT NULL,
    p_estimated_delivery TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_shipment_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Check if user is admin
    IF NOT is_admin(v_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Unauthorized: Only admins can assign couriers'
        );
    END IF;
    
    -- Create shipment record
    INSERT INTO shipments (
        order_id,
        courier_name,
        tracking_id,
        awb_number,
        estimated_delivery,
        status
    ) VALUES (
        p_order_id,
        p_courier_name,
        p_tracking_id,
        p_awb_number,
        p_estimated_delivery,
        'pending'
    ) RETURNING id INTO v_shipment_id;
    
    -- Update order tracking number
    UPDATE orders
    SET tracking_number = p_tracking_id
    WHERE id = p_order_id;
    
    -- Add timeline entry
    INSERT INTO order_timeline (order_id, status, message)
    VALUES (
        p_order_id,
        'shipped',
        'Shipped via ' || p_courier_name || COALESCE(' - Tracking: ' || p_tracking_id, '')
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'shipment_id', v_shipment_id,
        'courier_name', p_courier_name,
        'tracking_id', p_tracking_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get Order Statistics for Admin Dashboard
CREATE OR REPLACE FUNCTION get_order_statistics(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_stats JSONB;
BEGIN
    -- Check if user is admin
    IF NOT is_admin(auth.uid()) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Unauthorized: Only admins can view statistics'
        );
    END IF;
    
    -- Calculate statistics
    SELECT jsonb_build_object(
        'total_orders', COUNT(*),
        'total_revenue', COALESCE(SUM(total_amount), 0),
        'pending_orders', COUNT(*) FILTER (WHERE status = 'pending'),
        'confirmed_orders', COUNT(*) FILTER (WHERE status = 'confirmed'),
        'processing_orders', COUNT(*) FILTER (WHERE status = 'processing'),
        'shipped_orders', COUNT(*) FILTER (WHERE status = 'shipped'),
        'delivered_orders', COUNT(*) FILTER (WHERE status = 'delivered'),
        'cancelled_orders', COUNT(*) FILTER (WHERE status = 'cancelled'),
        'cod_orders', COUNT(*) FILTER (WHERE payment_method = 'Cash on Delivery'),
        'prepaid_orders', COUNT(*) FILTER (WHERE payment_method != 'Cash on Delivery'),
        'high_risk_orders', COUNT(*) FILTER (WHERE risk_score > 70),
        'sla_breached', COUNT(*) FILTER (WHERE sla_breach = true)
    ) INTO v_stats
    FROM orders
    WHERE (p_start_date IS NULL OR created_at >= p_start_date)
      AND (p_end_date IS NULL OR created_at <= p_end_date);
    
    RETURN jsonb_build_object('success', true, 'data', v_stats);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. ENHANCED RLS POLICIES FOR ORDERS
-- =====================================================

-- Drop existing policies if needed and recreate
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
    ON orders FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins can update all orders
CREATE POLICY "Admins can update orders"
    ON orders FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()));

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

-- Full-text search on customer info (if needed)
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address_gin 
ON orders USING gin(shipping_address);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_status_created 
ON orders(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON orders(payment_method, payment_status);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION update_order_status TO authenticated;
GRANT EXECUTE ON FUNCTION assign_courier TO authenticated;
GRANT EXECUTE ON FUNCTION get_order_statistics TO authenticated;

-- =====================================================
-- IMPORTANT: ADD YOUR ADMIN USER
-- =====================================================
-- After running this script, add your admin user:
-- 
-- INSERT INTO admins (id, email, full_name)
-- VALUES (
--   'your-user-uuid-from-auth.users',
--   'admin@example.com',
--   'Admin Name'
-- );
--
-- To get your user UUID, run:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
