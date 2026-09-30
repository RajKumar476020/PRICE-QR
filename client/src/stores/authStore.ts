import { create } from 'zustand';
import type { User, Business } from '../types';
import { api } from '../services/api';

const SELECTED_BIZ_KEY = 'priceqr_selected_business_id';

interface AuthState {
  user: User | null;
  token: string | null;
  currentBusiness: Business | null;
  businesses: Business[];
  isLoading: boolean;
  isInitialized: boolean;

  setAuth: (user: User, token: string, businesses?: Business[]) => void;
  setCurrentBusiness: (business: Business) => void;
  setBusinesses: (businesses: Business[]) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('qr_access_token'),
  currentBusiness: null,
  businesses: [],
  isLoading: true,
  isInitialized: false,

  setAuth: (user, token, businesses = []) => {
    api.setToken(token);
    const savedBizId = localStorage.getItem(SELECTED_BIZ_KEY);
    const matched = savedBizId ? businesses.find((b) => b.id === savedBizId) : null;
    const activeBusiness = matched || (businesses.length > 0 ? businesses[0] : null);

    if (activeBusiness?.id) {
      localStorage.setItem(SELECTED_BIZ_KEY, activeBusiness.id);
    }

    set({
      user,
      token,
      businesses,
      currentBusiness: activeBusiness,
      isLoading: false,
      isInitialized: true,
    });

    // If active business is missing detailed relations (e.g. hours), fetch full details
    if (activeBusiness?.id && (!activeBusiness.hours || !activeBusiness.currency)) {
      api
        .getBusiness(activeBusiness.id)
        .then((fullBiz) => {
          if (fullBiz) {
            set((state) => ({
              currentBusiness: state.currentBusiness?.id === fullBiz.id ? fullBiz : state.currentBusiness,
              businesses: state.businesses.map((b) => (b.id === fullBiz.id ? fullBiz : b)),
            }));
          }
        })
        .catch(() => {});
    }
  },

  setCurrentBusiness: (business) => {
    if (business?.id) {
      localStorage.setItem(SELECTED_BIZ_KEY, business.id);
    }
    set({ currentBusiness: business });

    // Ensure full details (hours, currency, categories) are present
    if (business?.id && (!business.hours || !business.currency)) {
      api
        .getBusiness(business.id)
        .then((fullBiz) => {
          if (fullBiz) {
            set((state) => ({
              currentBusiness: state.currentBusiness?.id === fullBiz.id ? fullBiz : state.currentBusiness,
              businesses: state.businesses.map((b) => (b.id === fullBiz.id ? fullBiz : b)),
            }));
          }
        })
        .catch(() => {});
    }
  },

  setBusinesses: (businesses) => {
    const savedBizId = localStorage.getItem(SELECTED_BIZ_KEY);
    const matched = savedBizId ? businesses.find((b) => b.id === savedBizId) : null;
    const active = matched || (businesses.length > 0 ? businesses[0] : null);

    if (active?.id) {
      localStorage.setItem(SELECTED_BIZ_KEY, active.id);
    }

    set((state) => ({
      businesses,
      currentBusiness: state.currentBusiness
        ? businesses.find((b) => b.id === state.currentBusiness?.id) || active
        : active,
    }));
  },

  logout: () => {
    api.setToken(null);
    localStorage.removeItem(SELECTED_BIZ_KEY);
    set({
      user: null,
      token: null,
      currentBusiness: null,
      businesses: [],
      isLoading: false,
      isInitialized: true,
    });
  },

  initAuth: async () => {
    const token = localStorage.getItem('qr_access_token');
    if (!token) {
      set({ isLoading: false, isInitialized: true, user: null, token: null });
      return;
    }

    api.setToken(token);
    try {
      const data = await api.getMe();
      const businesses: Business[] = data.businesses || [];
      const savedBizId = localStorage.getItem(SELECTED_BIZ_KEY);
      const matched = savedBizId ? businesses.find((b) => b.id === savedBizId) : null;
      const current = matched || (businesses.length > 0 ? businesses[0] : null);

      if (current?.id) {
        localStorage.setItem(SELECTED_BIZ_KEY, current.id);
      }

      // If we have a current business, load full business details
      let fullBusiness = current;
      if (current?.id) {
        try {
          fullBusiness = await api.getBusiness(current.id);
        } catch {
          fullBusiness = current;
        }
      }

      set({
        user: {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: data.createdAt,
        },
        businesses: businesses.map((b) => (b.id === fullBusiness?.id ? fullBusiness : b)),
        currentBusiness: fullBusiness,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      api.setToken(null);
      localStorage.removeItem(SELECTED_BIZ_KEY);
      set({ user: null, token: null, isLoading: false, isInitialized: true });
    }
  },

  refreshMe: async () => {
    try {
      const data = await api.getMe();
      const businesses = await api.getMyBusinesses();
      const savedBizId = localStorage.getItem(SELECTED_BIZ_KEY);
      const current = get().currentBusiness;
      const matched = current
        ? businesses.find((b: any) => b.id === current.id)
        : savedBizId
        ? businesses.find((b: any) => b.id === savedBizId)
        : businesses[0] || null;

      if (matched?.id) {
        localStorage.setItem(SELECTED_BIZ_KEY, matched.id);
      }

      set({
        user: {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: data.createdAt,
        },
        businesses,
        currentBusiness: matched,
      });
    } catch (e) {
      console.error('Failed to refresh user state:', e);
    }
  },
}));

// Listen for global unauthorized events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
