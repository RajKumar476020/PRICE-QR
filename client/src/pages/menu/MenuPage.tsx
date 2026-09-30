import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Layers,
  Sparkles,
  ArrowUpDown,
  Package,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api, resolveImageUrl } from '../../services/api';
import type { Category, Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { PriceDisplay } from '../../components/ui/PriceDisplay';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../components/ui/Toast';
import { ProductModal } from './ProductModal';
import { CategoriesModal } from './CategoriesModal';

export const MenuPage: React.FC = () => {
  const { currentBusiness, isLoading: isAuthLoading } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete Confirmations
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const fetchData = async () => {
    if (!currentBusiness?.id) return;
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        api.getCategories(currentBusiness.id),
        api.getProducts(currentBusiness.id),
      ]);
      setCategories(cats);
      setProducts(prods);

      // Check if URL requested adding a new product
      if (searchParams.get('action') === 'new-product') {
        setEditingProduct(null);
        setIsProductModalOpen(true);
        setSearchParams({});
      }
    } catch (e) {
      console.error('Failed to fetch catalog:', e);
      toast.error('Failed to load catalog data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentBusiness?.id]);

  if (!currentBusiness) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 animate-pulse rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </div>
    );
  }

  // Handlers for Products
  const handleSaveProduct = async (data: any) => {
    try {
      if (editingProduct) {
        await api.updateProduct(currentBusiness.id, editingProduct.id, data);
        toast.success('Product updated successfully!');
      } else {
        await api.createProduct(currentBusiness.id, data);
        toast.success('Product created successfully!');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to save product', err.message);
    }
  };

  const handleDuplicateProduct = async (prod: Product) => {
    try {
      await api.duplicateProduct(currentBusiness.id, prod.id);
      toast.success(`Duplicated "${prod.name}"`);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to duplicate', err.message);
    }
  };

  const handleToggleAvailability = async (prod: Product) => {
    try {
      await api.toggleProductAvailability(currentBusiness.id, prod.id);
      toast.success(
        prod.isAvailable ? `Marked "${prod.name}" as Sold Out` : `Marked "${prod.name}" as Available`,
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, isAvailable: !p.isAvailable } : p)),
      );
    } catch (err: any) {
      toast.error('Failed to update status', err.message);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await api.deleteProduct(currentBusiness.id, deletingProduct.id);
      toast.success(`Deleted "${deletingProduct.name}"`);
      setDeletingProduct(null);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete', err.message);
    }
  };

  // Handlers for Categories
  const handleSaveCategory = async (data: any) => {
    try {
      if (editingCategory) {
        await api.updateCategory(currentBusiness.id, editingCategory.id, data);
        toast.success('Category updated successfully!');
      } else {
        await api.createCategory(currentBusiness.id, data);
        toast.success('Category created successfully!');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to save category', err.message);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      await api.deleteCategory(currentBusiness.id, deletingCategory.id);
      toast.success(`Deleted category "${deletingCategory.name}"`);
      setDeletingCategory(null);
      if (selectedCategoryId === deletingCategory.id) {
        setSelectedCategoryId('all');
      }
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete category', err.message);
    }
  };

  // Filter products by selected category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Products & Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your catalog items, services, prices, discounts, and categories in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            Add Category
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Product / Service
          </Button>
        </div>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="space-y-4">
        <div className="max-w-md">
          <Input
            placeholder="Search items by name or ingredients..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Horizontal Scrolling Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Items ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;

            return (
              <div key={cat.id} className="relative inline-flex items-center group">
                <button
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.name} ({count})
                </button>

                {/* Edit Category Icon Button on Hover */}
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsCategoryModalOpen(true);
                  }}
                  title="Edit Category"
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="w-7 h-7" />}
          title={searchQuery ? 'No matching products or services found' : 'Your catalog is empty'}
          description={
            searchQuery
              ? 'Try adjusting your search terms or selecting another category.'
              : 'Add your first product or service to start building your live digital price list.'
          }
          actionText={searchQuery ? 'Clear Search' : 'Add First Product / Service'}
          onAction={() => {
            if (searchQuery) {
              setSearchQuery('');
            } else {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((prod) => {
            return (
              <Card
                key={prod.id}
                className={`p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  !prod.isAvailable ? 'opacity-60 bg-slate-50' : 'bg-white'
                }`}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  {prod.imageUrl ? (
                    <img
                      src={resolveImageUrl(prod.imageUrl)}
                      alt={prod.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-slate-200 shrink-0 shadow-subtle"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                            {prod.name}
                          </h4>
                          {prod.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Featured
                            </span>
                          )}
                          {prod.dietaryType === 'VEG' && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Veg
                            </span>
                          )}
                          {prod.dietaryType === 'VEGAN' && (
                            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                              Vegan
                            </span>
                          )}
                          {prod.dietaryType === 'NON_VEG' && (
                            <span className="text-[10px] text-red-700 font-bold bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                              Non-Veg
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {prod.category?.name || 'General'}
                        </div>
                      </div>
                    </div>

                    {prod.description && (
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    )}

                    <div className="mt-3">
                      <PriceDisplay
                        price={prod.price}
                        discountPrice={prod.discountPrice}
                        currency={currentBusiness.currency}
                        size="md"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Availability toggle */}
                  <button
                    onClick={() => handleToggleAvailability(prod)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      prod.isAvailable
                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-slate-500 bg-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    {prod.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{prod.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                  </button>

                  {/* Actions: Duplicate, Edit, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateProduct(prod)}
                      title="Duplicate product"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsProductModalOpen(true);
                      }}
                      title="Edit product"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeletingProduct(prod)}
                      title="Delete product"
                      className="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        currency={currentBusiness.currency}
        businessId={currentBusiness.id}
        onCategoryCreated={(newCat) => {
          setCategories((prev) => [...prev, newCat]);
        }}
      />

      {/* Category Add/Edit Modal */}
      <CategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSaveCategory}
        category={editingCategory}
      />

      {/* Delete Product Confirmation Modal (Section 48) */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title={`Delete ${deletingProduct?.name}?`}
        description="This item will be permanently removed from your digital price list and public storefront."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 mt-5">
          <Button variant="secondary" onClick={() => setDeletingProduct(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title={`Delete Category "${deletingCategory?.name}"?`}
        description="All products assigned to this category will also be deleted from your menu."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 mt-5">
          <Button variant="secondary" onClick={() => setDeletingCategory(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Delete Category
          </Button>
        </div>
      </Modal>
    </div>
  );
};
