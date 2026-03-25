import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalytics, Analytics, getCustomArtApplications, CustomArtApplication, getSellArtApplications, SellArtApplication } from '@/lib/adminStorage';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
    DollarSign,
    Package,
    FileText,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [recentApps, setRecentApps] = useState<any[]>([]);

    useEffect(() => {
        const data = getAnalytics();
        setAnalytics(data);
        
        const customApps = getCustomArtApplications();
        const sellApps = getSellArtApplications();
        
        // Combine and tag them
        const combined = [
            ...customApps.map(app => ({ ...app, type: 'Custom Art' })),
            ...sellApps.map(app => ({ ...app, type: 'Artist', customerName: app.artistName }))
        ];

        // Sort by date descending and take top 5
        const sortedApps = combined.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        setRecentApps(sortedApps);
    }, []);

    const stats = [
        {
            title: 'Total Revenue',
            value: analytics ? `$${analytics.totalRevenue.toLocaleString()}` : '$0',
            change: '+12.5%',
            isPositive: true,
            icon: DollarSign,
            bgColor: 'bg-green-500',
        },
        {
            title: 'Total Products',
            value: analytics?.totalProducts || 0,
            change: '+3',
            isPositive: true,
            icon: Package,
            bgColor: 'bg-blue-500',
        },
        {
            title: 'Pending Applications',
            value: analytics?.pendingApplications || 0,
            change: '-2',
            isPositive: true,
            icon: FileText,
            bgColor: 'bg-orange-500',
        },
        {
            title: 'Approved Artists',
            value: analytics?.approvedArtists || 0,
            change: '+5',
            isPositive: true,
            icon: Users,
            bgColor: 'bg-purple-500',
        },
    ];

    const chartData = analytics?.monthlyRevenue.map((revenue, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        revenue: revenue,
    })) || [];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Welcome Back, Admin</h1>
                    <p className="text-charcoal/60">Here's what's happening with your art marketplace today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        <span className="font-medium">{stat.change}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-charcoal/60 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <Card className="lg:col-span-2 border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-copper" />
                                Revenue Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#6b7280"
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke="#6b7280"
                                            style={{ fontSize: '12px' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#c87d4c"
                                            strokeWidth={3}
                                            dot={{ fill: '#c87d4c', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics?.topProducts.slice(0, 5).map((product, index) => (
                                    <div key={product.id} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-50 text-blue-700'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                                            <p className="text-xs text-charcoal/60">{product.type}</p>
                                        </div>
                                        <div className="text-sm font-medium text-charcoal">${product.price.toLocaleString()}</div>
                                    </div>
                                )) || (
                                        <p className="text-sm text-charcoal/60 text-center py-8">No products yet</p>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Applications Section */}
                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-copper" />
                                Recent Applications
                            </CardTitle>
                            <Link to="/admin/applications" className="text-sm text-copper hover:underline font-medium">
                                View All
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="border-b border-gray-100">
                                            <th className="py-3 px-4 text-sm font-medium text-charcoal/60">Applicant</th>
                                            <th className="py-3 px-4 text-sm font-medium text-charcoal/60">Type</th>
                                            <th className="hidden md:table-cell py-3 px-4 text-sm font-medium text-charcoal/60">Details</th>
                                            <th className="hidden lg:table-cell py-3 px-4 text-sm font-medium text-charcoal/60">Date</th>
                                            <th className="py-3 px-4 text-sm font-medium text-charcoal/60">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentApps.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-charcoal/40 text-sm">
                                                    No recent applications found
                                                </td>
                                            </tr>
                                        ) : (
                                            recentApps.map((app) => (
                                                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-4 font-medium text-charcoal">
                                                        {app.customerName}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-medium",
                                                            app.type === 'Custom Art' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                                                        )}>
                                                            {app.type}
                                                        </span>
                                                    </td>
                                                    <td className="hidden md:table-cell py-4 px-4 text-sm text-charcoal/80">
                                                        {app.type === 'Custom Art' ? `${app.serviceType}` : `${app.artworkCount} Artworks`}
                                                    </td>
                                                    <td className="hidden lg:table-cell py-4 px-4 text-sm text-charcoal/60">
                                                        {format(new Date(app.createdAt), 'MMM dd')}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <a
                                href="/admin/orders"
                                className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg hover:shadow-md transition-all border border-purple-500/20 group"
                            >
                                <Package className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-medium text-charcoal mb-1">Manage Orders</h3>
                                <p className="text-sm text-charcoal/60">View and track all orders</p>
                            </a>
                            <a
                                href="/admin/products"
                                className="p-6 bg-gradient-to-br from-copper/10 to-copper/5 rounded-lg hover:shadow-md transition-all border border-copper/20 group"
                            >
                                <Package className="w-8 h-8 text-copper mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-medium text-charcoal mb-1">Add New Product</h3>
                                <p className="text-sm text-charcoal/60">Create a new artwork listing</p>
                            </a>
                            <a
                                href="/admin/applications"
                                className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg hover:shadow-md transition-all border border-blue-500/20 group"
                            >
                                <FileText className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-medium text-charcoal mb-1">Review Applications</h3>
                                <p className="text-sm text-charcoal/60">Manage pending submissions</p>
                            </a>
                            <a
                                href="/admin/products"
                                className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg hover:shadow-md transition-all border border-green-500/20 group"
                            >
                                <TrendingUp className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-medium text-charcoal mb-1">View Analytics</h3>
                                <p className="text-sm text-charcoal/60">Check performance metrics</p>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
