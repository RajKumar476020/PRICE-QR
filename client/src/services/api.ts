const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('qr_access_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('qr_access_token', token);
    } else {
      localStorage.removeItem('qr_access_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        try {
          const errData = await response.json();
          if (Array.isArray(errData.message)) {
            errorMessage = errData.message.join(', ');
          } else if (errData.message) {
            errorMessage = errData.message;
          }
        } catch {
          errorMessage = `Server returned error (${response.status}: ${response.statusText})`;
        }

        if (response.status === 401 && this.token) {
          // Token expired or invalid
          this.setToken(null);
          window.dispatchEvent(new Event('auth:unauthorized'));
        }

        throw new Error(errorMessage);
      }

      // If empty response (204 or void)
      const text = await response.text();
      return text ? (JSON.parse(text) as T) : ({} as T);
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your network connection.');
      }
      throw err;
    }
  }

  // --- Auth APIs ---
  register(data: any) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  login(data: any) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMe() {
    return this.request<any>('/auth/me');
  }

  forgotPassword(data: any) {
    return this.request<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  resetPassword(data: any) {
    return this.request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- Business APIs ---
  getMyBusinesses() {
    return this.request<any[]>('/business');
  }

  getBusiness(id: string) {
    return this.request<any>(`/business/${id}`);
  }

  createBusiness(data: any) {
    return this.request<any>('/business', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateBusiness(id: string, data: any) {
    return this.request<any>(`/business/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  updateBusinessHours(id: string, hours: any[]) {
    return this.request<any>(`/business/${id}/hours`, {
      method: 'PUT',
      body: JSON.stringify(hours),
    });
  }

  getBusinessSummary(id: string) {
    return this.request<any>(`/business/${id}/summary`);
  }

  // --- Menu / Category APIs ---
  getCategories(businessId: string) {
    return this.request<any[]>(`/business/${businessId}/categories`);
  }

  createCategory(businessId: string, data: any) {
    return this.request<any>(`/business/${businessId}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateCategory(businessId: string, categoryId: string, data: any) {
    return this.request<any>(`/business/${businessId}/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteCategory(businessId: string, categoryId: string) {
    return this.request<any>(`/business/${businessId}/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  reorderCategories(businessId: string, categoryIds: string[]) {
    return this.request<any>(`/business/${businessId}/categories/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ categoryIds }),
    });
  }

  // --- Product APIs ---
  getProducts(businessId: string, categoryId?: string) {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request<any[]>(`/business/${businessId}/products${query}`);
  }

  createProduct(businessId: string, data: any) {
    return this.request<any>(`/business/${businessId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateProduct(businessId: string, productId: string, data: any) {
    return this.request<any>(`/business/${businessId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  duplicateProduct(businessId: string, productId: string) {
    return this.request<any>(`/business/${businessId}/products/${productId}/duplicate`, {
      method: 'POST',
    });
  }

  toggleProductAvailability(businessId: string, productId: string) {
    return this.request<any>(`/business/${businessId}/products/${productId}/toggle-availability`, {
      method: 'PATCH',
    });
  }

  deleteProduct(businessId: string, productId: string) {
    return this.request<any>(`/business/${businessId}/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // --- Offers APIs ---
  getOffers(businessId: string) {
    return this.request<any[]>(`/business/${businessId}/offers`);
  }

  createOffer(businessId: string, data: any) {
    return this.request<any>(`/business/${businessId}/offers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateOffer(businessId: string, offerId: string, data: any) {
    return this.request<any>(`/business/${businessId}/offers/${offerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  toggleOffer(businessId: string, offerId: string) {
    return this.request<any>(`/business/${businessId}/offers/${offerId}/toggle`, {
      method: 'PATCH',
    });
  }

  deleteOffer(businessId: string, offerId: string) {
    return this.request<any>(`/business/${businessId}/offers/${offerId}`, {
      method: 'DELETE',
    });
  }

  // --- QR APIs ---
  getQrData(businessId: string) {
    return this.request<any>(`/business/${businessId}/qr`);
  }

  updateQrStyle(businessId: string, qrStyle: any) {
    return this.request<any>(`/business/${businessId}/qr`, {
      method: 'PUT',
      body: JSON.stringify({ qrStyle }),
    });
  }

  recordQrDownload(businessId: string) {
    return this.request<any>(`/business/${businessId}/qr/download`, {
      method: 'POST',
    });
  }

  // --- Analytics APIs ---
  trackEvent(businessId: string, eventType: string, metadata?: any) {
    return this.request<any>('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ businessId, eventType, metadata }),
    });
  }

  getAnalytics(businessId: string, period: 'today' | '7d' | '30d' = '7d') {
    return this.request<any>(`/analytics/business/${businessId}?period=${period}`);
  }

  // --- Public APIs ---
  getPublicBusiness(publicId: string) {
    return this.request<any>(`/public/business/${publicId}`);
  }

  getPublicMenu(publicId: string, search?: string, categoryId?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<any>(`/public/business/${publicId}/menu${queryString}`);
  }

  // --- File Upload ---
  async uploadImage(file: File): Promise<{ url: string; filename: string; size: number }> {
    const url = `${API_BASE}/upload`;
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Image upload failed. Please try again.';
        try {
          const errData = await response.json();
          if (errData.message) {
            errorMessage = Array.isArray(errData.message)
              ? errData.message.join(', ')
              : errData.message;
          }
        } catch {
          errorMessage = `Upload error (${response.status}: ${response.statusText})`;
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as { url: string; filename: string; size: number };
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to upload server. Please check your network.');
      }
      throw err;
    }
  }

  // --- Admin APIs ---
  getAdminStats() {
    return this.request<any>('/admin/stats');
  }

  getAdminBusinesses(search?: string, status?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<any>(`/admin/businesses${queryString}`);
  }

  toggleBusinessStatus(id: string, status: 'ACTIVE' | 'SUSPENDED') {
    return this.request<any>(`/admin/businesses/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  getAdminUsers() {
    return this.request<any>('/admin/users');
  }
}

export const api = new ApiClient();

export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}
