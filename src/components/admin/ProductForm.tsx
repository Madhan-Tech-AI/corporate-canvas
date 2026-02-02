import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ProductFormProps {
    product?: any | null; // Using any for now to ease transition
    onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Painting',
        description: '',
        price: '',
        artistName: '',
        imageUrl: '',
        category: '',
        tags: '',
        size: 'Medium',
        orientation: 'Landscape',
        medium: 'Mixed Media',
        availability: 'In Stock'
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                type: product.type,
                description: product.description,
                price: product.price.toString(),
                artistName: product.artist_name || product.artistName,
                imageUrl: product.image_url || product.imageUrl,
                category: product.category,
                tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags,
                size: product.size || 'Medium',
                orientation: product.orientation || 'Landscape',
                medium: product.medium || 'Mixed Media',
                availability: product.availability || 'In Stock'
            });
            setImagePreview(product.image_url || product.imageUrl);
        }
    }, [product]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalImageUrl = formData.imageUrl;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                } else {
                    setIsSubmitting(false);
                    return;
                }
            }

            const productData = {
                name: formData.name,
                type: formData.type,
                description: formData.description,
                price: parseFloat(formData.price),
                artist_name: formData.artistName,
                image_url: finalImageUrl,
                category: formData.category,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                size: formData.size,
                orientation: formData.orientation,
                medium: formData.medium,
                availability: formData.availability
            };

            let error;
            if (product?.id) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([productData]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(product ? 'Product updated' : 'Product created');
            onClose();
        } catch (error: any) {
            console.error('Error saving product:', error);
            toast.error(error.message || 'Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-serif text-charcoal">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Artwork Title"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Artist</label>
                            <input
                                required
                                value={formData.artistName}
                                onChange={e => setFormData(p => ({ ...p, artistName: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Artist Name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price</label>
                            <input
                                required
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <input
                                value={formData.category}
                                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Abstract, Landscape..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Size</label>
                            <select
                                value={formData.size}
                                onChange={e => setFormData(p => ({ ...p, size: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Orientation</label>
                            <select
                                value={formData.orientation}
                                onChange={e => setFormData(p => ({ ...p, orientation: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option>Landscape</option>
                                <option>Portrait</option>
                                <option>Square</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Medium</label>
                            <input
                                value={formData.medium}
                                onChange={e => setFormData(p => ({ ...p, medium: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Oil, Acrylic, Bronze..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Availability</label>
                            <select
                                value={formData.availability}
                                onChange={e => setFormData(p => ({ ...p, availability: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option>In Stock</option>
                                <option>Made to Order</option>
                                <option>Sold Out</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags (comma separated)</label>
                        <input
                            value={formData.tags}
                            onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="office, luxury, modern"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                <Upload className="w-6 h-6 text-copper" />
                                <span className="text-sm font-medium">
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                </span>
                            </label>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-4 max-h-48 mx-auto rounded-lg object-contain"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-copper hover:bg-copper-dark text-white">
                            {isSubmitting ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
