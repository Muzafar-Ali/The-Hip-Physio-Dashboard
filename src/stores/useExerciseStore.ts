// stores/useExerciseStore.ts
import { create } from 'zustand';

import { Exercise } from '@/lib/types';
import { apiService } from '@/services/apiServices';

interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  fetchExercises: () => Promise<void>;
  addExercise: (formData: FormData) => Promise<boolean>;
  updateExercise: (formData: FormData) => Promise<boolean>;
  deleteExercise: (exerciseId: string) => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  loading: false,
  error: null,
  fetchExercises: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getExercises();
      set({ exercises: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch exercises', loading: false });
    }
  },

  addExercise: async (formData) => {
    set({ loading: true, error: null });
    try {
      const newExercise = await apiService.addExercise(formData);
      set(state => ({ exercises: [newExercise, ...state.exercises], loading: false }));
      return true; // Indicate success
    } catch (err) {
      set({ error: 'Failed to add exercise', loading: false });
      return false; // Indicate failure
    }
  },

  updateExercise: async (formData) => {
    set({ loading: true, error: null });
    try {
      const updatedExercise = await apiService.updateExercise(formData);
      set(state => ({
        exercises: state.exercises.map(ex => ex._id === updatedExercise._id ? updatedExercise : ex),
        loading: false
      }));
      return true; // Indicate success
    } catch (err) {
      set({ error: 'Failed to update exercise', loading: false });
      return false; // Indicate failure
    }
  },

  deleteExercise: async (exerciseId) => {
    set({ loading: true, error: null });
    try {
      await apiService.deleteExercise(exerciseId);
      set(state => ({
        exercises: state.exercises.filter(ex => ex._id !== exerciseId),
        loading: false
      }));
    } catch (err) {
      set({ error: 'Failed to delete exercise', loading: false });
    }
  },
}));
