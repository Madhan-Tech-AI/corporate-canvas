import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
    ArrowLeft, Package, MapPin, CreditCard, User, Phone, Mail,
    Clock, CheckCircle2, AlertCircle, Truck, Save, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getOrders as getLocalOrders } from '@/lib/adminStorage';

interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_address: any;
    tracking_number?: string;
    risk_score: number;
    sla_breach: boolean;
    priority: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

interface OrderItem {
    id: string;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
}

interface StatusHistory {
    id: string;
    old_status: string;
    new_status: string;
    changed_by_type: string;
    reason?: string;
    created_at: string;
}

interface Shipment {
    id: string;
    courier_name: string;
    tracking_id?: string;
    awb_number?: string;
    estimated_delivery?: string;
    status: string;
    created_at: string;
}

interface OrderNote {
    id: string;
    note: string;
    is_internal: boolean;
    created_at: string;
    admin: {
        email: string;
    };
}

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [history, setHistory] = useState<StatusHistory[]>([]);
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [notes, setNotes] = useState<OrderNote[]>([]);
    const [customerInfo, setCustomerInfo] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Status update form
    const [showStatusUpdate, setShowStatusUpdate] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusReason, setStatusReason] = useState('');

    // Courier assignment form
    const [showCourierForm, setShowCourierForm] = useState(false);
    const [courierData, setCourierData] = useState({
        courier_name: '',
        tracking_id: '',
        awb_number: '',
    });

    // Note form
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isInternal, setIsInternal] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            // Try fetching from Supabase first
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (!orderError && orderData) {
                setOrder(orderData);
                setNewStatus(orderData.status);

                // Fetch customer info
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', orderData.user_id)
                    .single();
                setCustomerInfo(profileData);

                // Fetch order items
                const { data: itemsData } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId);
                setItems(itemsData || []);
            } else {
                // Fallback to local storage
                console.log('Order not found in Supabase, checking local storage...');
                const localOrders = getLocalOrders();
                const localOrder = localOrders.find(o => o.id === orderId);

                if (localOrder) {
                    setOrder(localOrder as any);
                    setNewStatus(localOrder.status);
                    setItems(localOrder.items || []);
                    setCustomerInfo({
                        email: 'Guest Customer',
                        first_name: localOrder.shipping_address?.name,
                    });
                } else {
                    throw new Error('Order not found');
                }
            }

            // Fetch other details (these might fail safely if not in Supabase/not admin)
            try {
                const { data: historyData } = await supabase
                    .from('order_status_history')
                    .select('*')
                    .eq('order_id', orderId)
                    .order('created_at', { ascending: false });
                setHistory(historyData || []);

                const { data: shipmentsData } = await supabase
                    .from('shipments')
                    .select('*')
                    .eq('order_id', orderId)
                    .order('created_at', { ascending: false });
                setShipments(shipmentsData || []);

                const { data: notesData } = await supabase
                    .from('order_notes')
                    .select('*, admin:admin_id ( email )')
                    .eq('order_id', orderId)
                    .order('created_at', { ascending: false });
                setNotes(notesData || []);
            } catch (err) {
                console.warn('Optional details fetch failed:', err);
            }

        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Order not found or access denied');
            navigate('/admin/orders');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === order?.status) {
            toast.error('Please select a different status');
            return;
        }

        setIsUpdating(true);
        try {
            const { data, error } = await supabase.rpc('update_order_status', {
                p_order_id: orderId,
                p_new_status: newStatus,
                p_reason: statusReason || null,
            });

            if (error) throw error;

            if (data?.success) {
                toast.success('Order status updated successfully');
                setShowStatusUpdate(false);
                setStatusReason('');
                fetchOrderDetails();
            } else {
                toast.error(data?.error || 'Failed to update status');
            }
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error(error.message || 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAssignCourier = async () => {
        if (!courierData.courier_name) {
            toast.error('Please enter courier name');
            return;
        }

        setIsUpdating(true);
        try {
            const { data, error } = await supabase.rpc('assign_courier', {
                p_order_id: orderId,
                p_courier_name: courierData.courier_name,
                p_tracking_id: courierData.tracking_id || null,
                p_awb_number: courierData.awb_number || null,
            });

            if (error) throw error;

            if (data?.success) {
                toast.success('Courier assigned successfully');
                setShowCourierForm(false);
                setCourierData({ courier_name: '', tracking_id: '', awb_number: '' });
                fetchOrderDetails();
            } else {
                toast.error(data?.error || 'Failed to assign courier');
            }
        } catch (error: any) {
            console.error('Error assigning courier:', error);
            toast.error(error.message || 'Failed to assign courier');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) {
            toast.error('Please enter a note');
            return;
        }

        setIsUpdating(true);
        try {
            const { error } = await supabase.from('order_notes').insert({
                order_id: orderId,
                admin_id: (await supabase.auth.getUser()).data.user?.id,
                note: newNote,
                is_internal: isInternal,
            });

            if (error) throw error;

            toast.success('Note added successfully');
            setShowNoteForm(false);
            setNewNote('');
            fetchOrderDetails();
        } catch (error: any) {
            console.error('Error adding note:', error);
            toast.error(error.message || 'Failed to add note');
        } finally {
            setIsUpdating(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Package className="w-10 h-10 text-copper animate-spin" />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
                                <p className="text-sm text-gray-500">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowStatusUpdate(true)}
                                className="px-4 py-2 bg-copper text-white rounded-lg hover:bg-copper-dark transition-colors"
                            >
                                Update Status
                            </button>
                            <button
                                onClick={() => setShowCourierForm(true)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Assign Courier
                            </button>
                            <button
                                onClick={() => setShowNoteForm(true)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({items.length})</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Amount</span>
                                    <span className="text-copper">{formatCurrency(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status History */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
                            <div className="space-y-4">
                                {history.map((item, index) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center",
                                                index === 0 ? "bg-copper text-white" : "bg-gray-200 text-gray-600"
                                            )}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            {index < history.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {item.old_status ? `${item.old_status} → ${item.new_status}` : item.new_status}
                                                    </p>
                                                    {item.reason && (
                                                        <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Changed by {item.changed_by_type}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(item.created_at).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipment Info */}
                        {shipments.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Shipment Details
                                </h2>
                                {shipments.map((shipment) => (
                                    <div key={shipment.id} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Courier</p>
                                                <p className="font-medium">{shipment.courier_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Tracking ID</p>
                                                <p className="font-medium font-mono">{shipment.tracking_id || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">AWB Number</p>
                                                <p className="font-medium">{shipment.awb_number || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className="font-medium capitalize">{shipment.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Notes */}
                        {notes.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                                <div className="space-y-4">
                                    {notes.map((note) => (
                                        <div key={note.id} className="border-l-4 border-copper pl-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-gray-900">{note.note}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        By {note.admin?.email} • {new Date(note.created_at).toLocaleString('en-IN')}
                                                        {note.is_internal && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Internal</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Customer Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">
                                        {customerInfo?.first_name
                                            ? `${customerInfo.first_name} ${customerInfo.last_name || ''}`.trim()
                                            : order.shipping_address?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </p>
                                    <p className="font-medium">{customerInfo?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </p>
                                    <p className="font-medium">{order.shipping_address?.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Delivery Address
                            </h2>
                            <div className="text-sm space-y-1">
                                <p className="font-medium">{order.shipping_address?.name}</p>
                                <p className="text-gray-600">{order.shipping_address?.address}</p>
                                <p className="text-gray-600">
                                    {order.shipping_address?.city}, {order.shipping_address?.state}
                                </p>
                                <p className="text-gray-600">{order.shipping_address?.pincode}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Payment Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Method</p>
                                    <p className="font-medium">{order.payment_method}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={cn(
                                        "inline-block px-2 py-1 text-xs rounded-full",
                                        order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    )}>
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Metadata */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Metadata</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Risk Score</span>
                                    <span className={cn(
                                        "font-medium",
                                        order.risk_score > 70 ? "text-red-600" : order.risk_score > 40 ? "text-yellow-600" : "text-green-600"
                                    )}>
                                        {order.risk_score}/100
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Priority</span>
                                    <span className="font-medium capitalize">{order.priority}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">SLA Breach</span>
                                    <span className={cn(
                                        "font-medium",
                                        order.sla_breach ? "text-red-600" : "text-green-600"
                                    )}>
                                        {order.sla_breach ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusUpdate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20"
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                                <textarea
                                    value={statusReason}
                                    onChange={(e) => setStatusReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20"
                                    placeholder="Enter reason for status change..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2 bg-copper text-white rounded-lg hover:bg-copper-dark disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? <Package className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Update
                                </button>
                                <button
                                    onClick={() => setShowStatusUpdate(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Courier Assignment Modal */}
            {showCourierForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Assign Courier</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Courier Name *</label>
                                <input
                                    type="text"
                                    value={courierData.courier_name}
                                    onChange={(e) => setCourierData({ ...courierData, courier_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20"
                                    placeholder="e.g., Delhivery, Blue Dart"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking ID</label>
                                <input
                                    type="text"
                                    value={courierData.tracking_id}
                                    onChange={(e) => setCourierData({ ...courierData, tracking_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20"
                                    placeholder="Enter tracking number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">AWB Number</label>
                                <input
                                    type="text"
                                    value={courierData.awb_number}
                                    onChange={(e) => setCourierData({ ...courierData, awb_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20"
                                    placeholder="Enter AWB number"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAssignCourier}
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2 bg-copper text-white rounded-lg hover:bg-copper-dark disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? <Package className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                                    Assign
                                </button>
                                <button
                                    onClick={() => setShowCourierForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showNoteForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Add Note</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20"
                                    placeholder="Enter note..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isInternal"
                                    checked={isInternal}
                                    onChange={(e) => setIsInternal(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <label htmlFor="isInternal" className="text-sm text-gray-700">
                                    Internal note (not visible to customer)
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddNote}
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2 bg-copper text-white rounded-lg hover:bg-copper-dark disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? <Package className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Add Note
                                </button>
                                <button
                                    onClick={() => setShowNoteForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
