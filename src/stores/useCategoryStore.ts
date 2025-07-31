// stores/useCategoryStore.ts
import { create } from 'zustand';

import { ExerciseCategory } from '@/lib/types';
import { apiService } from '@/services/apiServices';

interface CategoryState {
    categories: ExerciseCategory[];
    loading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    loading: false,
    error: null,
    fetchCategories: async () => {
        // Avoid refetching if data already exists
        if (get().categories.length > 0) return; 
        set({ loading: true, error: null });
        try {
            const data = await apiService.getExerciseCategories();
            set({ categories: data, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch categories', loading: false });
        }
    },
}));
