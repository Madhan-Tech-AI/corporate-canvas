import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    saveProduct,
    updateProduct,
    Product
} from '@/lib/adminStorage';
import { toast } from 'sonner';

interface ProductFormProps {
    product?: Product | null;
    onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Painting' as Product['type'],
        description: '',
        price: '',
        artistName: '',
        imageUrl: '',
        category: '',
        tags: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                type: product.type,
                description: product.description,
                price: product.price.toString(),
                artistName: product.artistName,
                imageUrl: product.imageUrl,
                category: product.category,
                tags: product.tags.join(', '),
            });
        }
    }, [product]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const productData = {
                name: formData.name,
                type: formData.type,
                description: formData.description,
                price: parseFloat(formData.price),
                artistName: formData.artistName,
                imageUrl: formData.imageUrl,
                category: formData.category,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            if (product) {
                updateProduct(product.id, productData);
                toast.success('Product updated successfully');
            } else {
                saveProduct(productData);
                toast.success('Product created successfully');
            }

            onClose();
        } catch (error) {
            toast.error('Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-serif text-charcoal">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                            placeholder="Abstract Serenity"
                        />
                    </div>

                    {/* Product Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Product Type *
                        </label>
                        <select
                            required
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Product['type'] }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                        >
                            <option value="Painting">Painting</option>
                            <option value="Sculpture">Sculpture</option>
                            <option value="Print">Print</option>
                            <option value="Digital Art">Digital Art</option>
                            <option value="Photography">Photography</option>
                            <option value="Mixed Media">Mixed Media</option>
                        </select>
                    </div>

                    {/* Artist Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Artist Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.artistName}
                            onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                            placeholder="Jane Doe"
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Price (USD) *
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                            placeholder="1500.00"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Category
                        </label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                            placeholder="Contemporary, Abstract, etc."
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
                            placeholder="abstract, colorful, modern"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 resize-none"
                            placeholder="Describe the artwork..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-charcoal">
                            Product Image
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                <div className="bg-copper/10 p-3 rounded-full text-copper mb-2">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-medium text-charcoal">
                                    {formData.imageUrl ? 'Change Image' : 'Upload Image'}
                                </span>
                                <span className="text-xs text-charcoal/40">PNG, JPG up to 5MB</span>
                            </label>
                            {formData.imageUrl && (
                                <div className="mt-4">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="max-h-48 mx-auto rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-copper hover:bg-copper-dark text-white"
                        >
                            {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
