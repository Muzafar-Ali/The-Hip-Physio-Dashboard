import { create } from 'zustand';
import { ContentState } from '@/lib/types';
import { apiService } from '@/services/apiServices';

export const useContentStore = create<ContentState>((set, get) => ({
  pages: [],
  loading: false,
  error: null,
  fetchPages: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getContentPages();
      set({ pages: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch content pages', loading: false });
    }
  },
  updatePage: async (slug, content) => {
    set({ loading: true, error: null });
    try {
        const updatedPage = await apiService.updateContentPage(slug, content);
        const pages = get().pages.map(p => p.slug === slug ? updatedPage : p);
        set({ pages, loading: false });
    } catch (err) {
        set({ error: 'Failed to update page', loading: false });
    }
  }
}));