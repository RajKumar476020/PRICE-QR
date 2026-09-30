import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Check, X, Sparkles, FolderPlus, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { api } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import type { Category, Product } from '../../types';

const productSchema = z
  .object({
    name: z.string().min(1, 'Product or service name is required'),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Please select a category'),
    price: z.preprocess((val) => Number(val), z.number().min(0, 'Price cannot be negative')),
    discountPrice: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
      z.number().min(0, 'Discount price cannot be negative').nullable().optional(),
    ),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    dietaryType: z.enum(['VEG', 'NON_VEG', 'VEGAN', 'NONE']).default('NONE'),
  })
  .refine(
    (data) => {
      if (data.discountPrice !== null && data.discountPrice !== undefined) {
        return data.discountPrice <= data.price;
      }
      return true;
    },
    {
      message: 'Discount price cannot exceed original price',
      path: ['discountPrice'],
    },
  );

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  product?: Product | null;
  categories: Category[];
  currency?: string;
  businessId: string;
  onCategoryCreated?: (newCategory: Category) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories: initialCategories,
  currency = '₹',
  businessId,
  onCategoryCreated,
}) => {
  const isEditing = !!product;
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Inline Category Creator State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const selectedCategoryId = watch('categoryId');

  // Keep categories in sync with props
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId,
        price: product.price,
        discountPrice: product.discountPrice ?? undefined,
        imageUrl: product.imageUrl || '',
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured,
        dietaryType: product.dietaryType || 'NONE',
      });
    } else {
      reset({
        name: '',
        description: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        price: 0,
        discountPrice: null,
        imageUrl: '',
        isAvailable: true,
        isFeatured: false,
        dietaryType: 'NONE',
      });
    }
    setShowAddCategory(false);
    setNewCatName('');
    setNewCatDesc('');
  }, [product, categories, reset, isOpen]);

  const handleQuickAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    if (!businessId) {
      toast.error('Business ID not found');
      return;
    }

    setIsCreatingCat(true);
    try {
      const created = await api.createCategory(businessId, {
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined,
      });

      // Update local categories
      const updated = [...categories, created];
      setCategories(updated);

      // Automatically select newly created category in the form
      setValue('categoryId', created.id, { shouldValidate: true });

      // Notify parent component
      onCategoryCreated?.(created);

      toast.success(`Category "${created.name}" created and selected!`);
      setShowAddCategory(false);
      setNewCatName('');
      setNewCatDesc('');
    } catch (err: any) {
      toast.error('Failed to create category', err.message);
    } finally {
      setIsCreatingCat(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product / Service' : 'Add New Product or Service'}
      description="Provide pricing, details, category, and an image for your catalog."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product / Service Name */}
        <Input
          label="Product / Service Name *"
          placeholder="e.g. Deluxe Hair Styling, Synthetic Oil Change, or Sourdough Pizza"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Category Selection & Inline Quick Add */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Category *</label>
            {!showAddCategory && (
              <button
                type="button"
                onClick={() => setShowAddCategory(true)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Category</span>
              </button>
            )}
          </div>

          {/* Quick Category Creator Box */}
          {showAddCategory ? (
            <div className="p-3.5 bg-brand-50/50 border border-brand-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-brand-600" />
                  Quick Create Category
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Category Name * (e.g. Hair Treatments, Appetizers)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                  className="text-xs px-3 py-2 rounded-xl border border-brand-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="text"
                  placeholder="Short Description (Optional)"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-brand-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddCategory(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleQuickAddCategory}
                  isLoading={isCreatingCat}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Save & Select Category
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                error={errors.categoryId?.message}
                {...register('categoryId')}
                onChange={(e) => {
                  if (e.target.value === '__CREATE_NEW__') {
                    setShowAddCategory(true);
                  } else {
                    setValue('categoryId', e.target.value);
                  }
                }}
              >
                {categories.length === 0 ? (
                  <option value="">No categories yet — click + Add New Category</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
                <option value="__CREATE_NEW__">+ Create new category...</option>
              </Select>

              {/* Dietary preference (relevant for food / dining businesses, optional for others) */}
              <Select
                label="Dietary / Item Type (Optional)"
                helperText="For food items, mark if vegetarian or vegan"
                {...register('dietaryType')}
              >
                <option value="NONE">Standard / Not Specified</option>
                <option value="VEG">🟢 Vegetarian</option>
                <option value="NON_VEG">🔴 Non-Vegetarian</option>
                <option value="VEGAN">🌱 100% Vegan</option>
              </Select>
            </div>
          )}
        </div>

        {/* Pricing Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Regular Price (${currency}) *`}
            type="number"
            step="any"
            placeholder="399"
            error={errors.price?.message}
            {...register('price')}
          />

          <Input
            label={`Discount / Sale Price (${currency})`}
            type="number"
            step="any"
            placeholder="349 (Optional)"
            helperText="Shows a discounted sale badge on your live storefront"
            error={errors.discountPrice?.message}
            {...register('discountPrice')}
          />
        </div>

        {/* Image Upload Component */}
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Product / Item Image (Optional)"
              value={field.value}
              onChange={field.onChange}
              aspectRatio="product"
              helperText="Upload a photo from your device or paste an image URL"
              error={errors.imageUrl?.message}
            />
          )}
        />

        {/* Description / Details */}
        <Textarea
          label="Description & Specifications"
          placeholder="Add details, features, ingredients, warranty, or instructions for this item..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Availability & Featured Item Checkboxes */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              {...register('isAvailable')}
            />
            <span>Available (In Stock / Bookable)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              {...register('isFeatured')}
            />
            <span>Featured Item (Starred at top of catalog)</span>
          </label>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Product / Service'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
