import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Filter,
    X,
    Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ProductForm from '../../components/admin/ProductForm';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const productTypes = ['all', 'Painting', 'Sculpture', 'Print', 'Digital Art', 'Photography', 'Mixed Media'];

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, selectedType]);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.artist_name && p.artist_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by type
        if (selectedType !== 'all') {
            filtered = filtered.filter(p => p.type === selectedType);
        }

        setFilteredProducts(filtered);
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', productToDelete);

                if (error) throw error;

                toast.success('Product deleted successfully');
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
        loadProducts();
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-charcoal mb-2">Products</h1>
                        <p className="text-charcoal/60">Manage your artwork catalog</p>
                    </div>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-copper hover:bg-copper-dark text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Product
                    </Button>
                </div>

                {/* Filters */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-charcoal/60" />
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                                >
                                    {productTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type === 'all' ? 'All Types' : type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters */}
                            {(searchQuery || selectedType !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedType('all');
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-copper" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-charcoal/40" />
                            </div>
                            <h3 className="text-lg font-medium text-charcoal mb-2">No products found</h3>
                            <p className="text-charcoal/60 mb-6">
                                {searchQuery || selectedType !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Get started by creating your first product'}
                            </p>
                            {!searchQuery && selectedType === 'all' && (
                                <Button onClick={() => setIsFormOpen(true)} className="bg-copper hover:bg-copper-dark text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-charcoal/30 text-4xl font-serif">{product.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 bg-white rounded-lg shadow-md hover:bg-copper hover:text-white transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 bg-white rounded-lg shadow-md hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="mb-2">
                                        <span className="text-xs bg-copper/10 text-copper px-2 py-1 rounded">
                                            {product.type}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-charcoal mb-1 truncate">{product.name}</h3>
                                    <p className="text-sm text-charcoal/60 mb-2">by {product.artist_name}</p>
                                    <p className="text-lg font-bold text-charcoal">${product.price.toLocaleString()}</p>
                                    <p className="text-xs text-charcoal/40 mt-2 line-clamp-2">{product.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Product Form Dialog */}
                {isFormOpen && (
                    <ProductForm
                        product={editingProduct}
                        onClose={handleFormClose}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product from your catalog.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
