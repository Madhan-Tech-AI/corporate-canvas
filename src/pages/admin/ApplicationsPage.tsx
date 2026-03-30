import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    getCustomArtApplications,
    getSellArtApplications,
    getContactMessages,
    updateCustomArtApplicationStatus,
    updateSellArtApplicationStatus,
    updateContactMessageStatus,
    CustomArtApplication,
    SellArtApplication,
    ContactMessage
} from '@/lib/adminStorage';
import {
    Calendar,
    Mail,
    User,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function ApplicationsPage() {
    const [customApps, setCustomApps] = useState<CustomArtApplication[]>([]);
    const [sellApps, setSellApps] = useState<SellArtApplication[]>([]);
    const [contactMsgs, setContactMsgs] = useState<ContactMessage[]>([]);
    const [selectedCustomApp, setSelectedCustomApp] = useState<CustomArtApplication | null>(null);
    const [selectedSellApp, setSelectedSellApp] = useState<SellArtApplication | null>(null);
    const [selectedContactMsg, setSelectedContactMsg] = useState<ContactMessage | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = () => {
        setCustomApps(getCustomArtApplications());
        setSellApps(getSellArtApplications());
        setContactMsgs(getContactMessages());
    };

    const handleCustomAppStatusUpdate = (id: string, status: CustomArtApplication['status']) => {
        updateCustomArtApplicationStatus(id, status);
        toast.success('Application status updated');
        loadApplications();
        setSelectedCustomApp(null);
    };

    const handleSellAppStatusUpdate = (id: string, status: SellArtApplication['status']) => {
        updateSellArtApplicationStatus(id, status);
        toast.success('Application status updated');
        loadApplications();
        setSelectedSellApp(null);
    };

    const handleContactMsgStatusUpdate = (id: string, status: ContactMessage['status']) => {
        updateContactMessageStatus(id, status);
        toast.success('Message status updated');
        loadApplications();
        setSelectedContactMsg(null);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string; color: string }> = {
            'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
            'in-review': { label: 'In Review', color: 'bg-blue-100 text-blue-700' },
            'approved': { label: 'Approved', color: 'bg-green-100 text-green-700' },
            'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700' },
            'completed': { label: 'Completed', color: 'bg-purple-100 text-purple-700' },
        };
        const variant = variants[status] || variants['pending'];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant.color}`}>
                {variant.label}
            </span>
        );
    };

    const filterApplications = (apps: any[]) => {
        if (filterStatus === 'all') return apps;
        return apps.filter(app => app.status === filterStatus);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Applications</h1>
                    <p className="text-charcoal/60">Manage customer and artist applications</p>
                </div>

                {/* Filter */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-charcoal mr-2">Filter:</span>
                            {['all', 'pending', 'in-review', 'approved', 'rejected', 'completed'].map(status => (
                                <Button
                                    key={status}
                                    variant={filterStatus === status ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterStatus(status)}
                                    className={filterStatus === status ? 'bg-copper hover:bg-copper-dark' : ''}
                                >
                                    {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="custom-art" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2 md:gap-0 bg-transparent md:bg-muted p-0 md:p-1 max-w-2xl">
                        <TabsTrigger value="custom-art" className="data-[state=active]:shadow-sm data-[state=active]:bg-white border md:border-none border-gray-200">Custom Art Requests</TabsTrigger>
                        <TabsTrigger value="sell-art" className="data-[state=active]:shadow-sm data-[state=active]:bg-white border md:border-none border-gray-200">Artist Applications</TabsTrigger>
                        <TabsTrigger value="contact-msgs" className="data-[state=active]:shadow-sm data-[state=active]:bg-white border md:border-none border-gray-200">Contact Requests</TabsTrigger>
                    </TabsList>

                    {/* Custom Art Applications */}
                    <TabsContent value="custom-art" className="space-y-4 mt-6">
                        {filterApplications(customApps).length === 0 ? (
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-12 text-center">
                                    <FileText className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-charcoal mb-2">No applications found</h3>
                                    <p className="text-charcoal/60">
                                        {filterStatus === 'all'
                                            ? 'Custom art requests will appear here'
                                            : `No ${filterStatus} applications`}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filterApplications(customApps).map((app) => (
                                    <Card key={app.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{app.style} {app.serviceType}</CardTitle>
                                                    <p className="text-sm text-charcoal/60 mt-1">{app.size}</p>
                                                </div>
                                                {getStatusBadge(app.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal">{app.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal/60">{app.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal/60">
                                                    {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-charcoal/80 line-clamp-2">{app.details}</p>
                                            <Button
                                                onClick={() => setSelectedCustomApp(app)}
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Sell Art Applications */}
                    <TabsContent value="sell-art" className="space-y-4 mt-6">
                        {filterApplications(sellApps).length === 0 ? (
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-12 text-center">
                                    <FileText className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-charcoal mb-2">No applications found</h3>
                                    <p className="text-charcoal/60">
                                        {filterStatus === 'all'
                                            ? 'Artist applications will appear here'
                                            : `No ${filterStatus} applications`}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filterApplications(sellApps).map((app) => (
                                    <Card key={app.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">{app.artistName}</CardTitle>
                                                {getStatusBadge(app.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal/60">{app.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal/60">
                                                    {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-charcoal/60">Portfolio: </span>
                                                <span className="text-charcoal font-medium">{app.artworkCount} artworks</span>
                                            </div>
                                            <p className="text-sm text-charcoal/80 line-clamp-2">{app.biography}</p>
                                            <Button
                                                onClick={() => setSelectedSellApp(app)}
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Contact Messages */}
                    <TabsContent value="contact-msgs" className="space-y-4 mt-6">
                        {filterApplications(contactMsgs).length === 0 ? (
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-12 text-center">
                                    <FileText className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-charcoal mb-2">No messages found</h3>
                                    <p className="text-charcoal/60">
                                        {filterStatus === 'all'
                                            ? 'Contact requests will appear here'
                                            : `No ${filterStatus} messages`}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filterApplications(contactMsgs).map((msg) => (
                                    <Card key={msg.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg truncate">{msg.subject}</CardTitle>
                                                {getStatusBadge(msg.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal font-medium">{msg.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal/60">{msg.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-charcoal/60" />
                                                <span className="text-charcoal/60">
                                                    {format(new Date(msg.createdAt), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-charcoal/80 line-clamp-2">{msg.message}</p>
                                            <Button
                                                onClick={() => setSelectedContactMsg(msg)}
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Custom Art Detail Dialog */}
                <Dialog open={!!selectedCustomApp} onOpenChange={() => setSelectedCustomApp(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Custom Art Request Details</DialogTitle>
                            <DialogDescription>Review and manage this application</DialogDescription>
                        </DialogHeader>
                        {selectedCustomApp && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Service Type</label>
                                        <p className="text-charcoal capitalize">{selectedCustomApp.serviceType}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Style</label>
                                        <p className="text-charcoal">{selectedCustomApp.style}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Size</label>
                                        <p className="text-charcoal">{selectedCustomApp.size}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedCustomApp.status)}</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Customer Name</label>
                                    <p className="text-charcoal">{selectedCustomApp.customerName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Email</label>
                                    <p className="text-charcoal">{selectedCustomApp.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Details</label>
                                    <p className="text-charcoal whitespace-pre-wrap">{selectedCustomApp.details}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Submitted</label>
                                    <p className="text-charcoal">{format(new Date(selectedCustomApp.createdAt), 'PPpp')}</p>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleCustomAppStatusUpdate(selectedCustomApp!.id, 'rejected')}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleCustomAppStatusUpdate(selectedCustomApp!.id, 'in-review')}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                In Review
                            </Button>
                            <Button
                                className="bg-copper hover:bg-copper-dark"
                                onClick={() => handleCustomAppStatusUpdate(selectedCustomApp!.id, 'approved')}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Sell Art Detail Dialog */}
                <Dialog open={!!selectedSellApp} onOpenChange={() => setSelectedSellApp(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Artist Application Details</DialogTitle>
                            <DialogDescription>Review and manage this application</DialogDescription>
                        </DialogHeader>
                        {selectedSellApp && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Artist Name</label>
                                        <p className="text-charcoal">{selectedSellApp.artistName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedSellApp.status)}</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Email</label>
                                    <p className="text-charcoal">{selectedSellApp.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Phone</label>
                                    <p className="text-charcoal">{selectedSellApp.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Portfolio</label>
                                    <p className="text-charcoal">{selectedSellApp.portfolio}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Artwork Count</label>
                                    <p className="text-charcoal">{selectedSellApp.artworkCount} pieces</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Biography</label>
                                    <p className="text-charcoal whitespace-pre-wrap">{selectedSellApp.biography}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Submitted</label>
                                    <p className="text-charcoal">{format(new Date(selectedSellApp.createdAt), 'PPpp')}</p>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleSellAppStatusUpdate(selectedSellApp!.id, 'rejected')}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSellAppStatusUpdate(selectedSellApp!.id, 'in-review')}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                In Review
                            </Button>
                            <Button
                                className="bg-copper hover:bg-copper-dark"
                                onClick={() => handleSellAppStatusUpdate(selectedSellApp!.id, 'approved')}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Contact Message Detail Dialog */}
                <Dialog open={!!selectedContactMsg} onOpenChange={() => setSelectedContactMsg(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Contact Request Details</DialogTitle>
                            <DialogDescription>Review and manage this message</DialogDescription>
                        </DialogHeader>
                        {selectedContactMsg && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Name</label>
                                        <p className="text-charcoal">{selectedContactMsg.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedContactMsg.status)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Email</label>
                                        <p className="text-charcoal">{selectedContactMsg.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-charcoal/60">Phone</label>
                                        <p className="text-charcoal">{selectedContactMsg.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Company</label>
                                    <p className="text-charcoal">{selectedContactMsg.company || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Subject</label>
                                    <p className="text-charcoal font-medium">{selectedContactMsg.subject}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Message</label>
                                    <p className="text-charcoal whitespace-pre-wrap">{selectedContactMsg.message}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-charcoal/60">Submitted</label>
                                    <p className="text-charcoal">{format(new Date(selectedContactMsg.createdAt), 'PPpp')}</p>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleContactMsgStatusUpdate(selectedContactMsg!.id, 'rejected')}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Dismiss
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleContactMsgStatusUpdate(selectedContactMsg!.id, 'in-review')}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                In Progress
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleContactMsgStatusUpdate(selectedContactMsg!.id, 'completed')}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Resolve
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
