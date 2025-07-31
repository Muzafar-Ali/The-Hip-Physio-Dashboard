// services/apiService.ts
import { DashboardAnalytics, Exercise, UserWithAnalytics, RehabPlan, Notification, ContentPage, ExerciseCategory } from '@/lib/types';
import { mockDashboardData, mockUsers, mockExercises, mockPlans, mockNotifications, mockContentPages, mockCategories } from '@/lib/mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Helper to simulate backend FormData processing
const processFormData = (formData: FormData): Omit<Exercise, '_id' | 'videoUrl'> => {
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const reps = formData.get('reps') as string;
    const sets = formData.get('sets') as string;
    const description = formData.get('description') as string;
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());
    return { name, category, reps, sets, description, tags };
}

export const apiService = {
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    await delay(500);
    console.log("Fetching dashboard analytics...");
    return mockDashboardData;
  },
  getUsers: async (): Promise<UserWithAnalytics[]> => {
    await delay(500);
    console.log("Fetching users...");
    return mockUsers;
  },
  getExercises: async (): Promise<Exercise[]> => {
    await delay(500);
    return mockExercises;
  },
  getRehabPlans: async (): Promise<RehabPlan[]> => {
    await delay(500);
    console.log("Fetching rehab plans...");
    return mockPlans;
  },
  getNotifications: async (): Promise<Notification[]> => {
    await delay(500);
    console.log("Fetching notifications...");
    return mockNotifications;
  },
  sendNotification: async (notification: Omit<Notification, '_id' | 'status' | 'sentTime'>): Promise<Notification> => {
    await delay(500);
    console.log("Sending notification:", notification);
    const newNotification: Notification = {
      _id: `notif_${Date.now()}`,
      status: 'Sent',
      sentTime: new Date().toISOString(),
      ...notification
    };
    mockNotifications.unshift(newNotification);
    return newNotification;
  },
  getContentPages: async (): Promise<ContentPage[]> => {
    await delay(500);
    console.log("Fetching content pages...");
    return mockContentPages;
  },
  updateContentPage: async(slug: string, content: string): Promise<ContentPage> => {
    await delay(500);
    console.log(`Updating page ${slug}`);
    const page = mockContentPages.find(p => p.slug === slug);
    if(page) {
        page.content = content;
        page.updatedAt = new Date().toISOString();
        return page;
    }
    throw new Error("Page not found");
  },
  getExerciseCategories: async (): Promise<ExerciseCategory[]> => {
    await delay(300);
    return mockCategories;
  },
  addExercise: async (formData: FormData): Promise<Exercise> => {
    await delay(1000);
    console.log("API: Adding exercise with data:", Object.fromEntries(formData));
    const newExerciseData = processFormData(formData);
    const newExercise: Exercise = {
      _id: `ex_${Date.now()}`,
      ...newExerciseData,
      videoUrl: 'https://example.com/new_video.mp4', // Mock URL
    };
    mockExercises.unshift(newExercise);
    return newExercise;
  },
  updateExercise: async (formData: FormData): Promise<Exercise> => {
    await delay(1000);
    console.log("API: Updating exercise with data:", Object.fromEntries(formData));
    const exerciseId = formData.get('_id') as string;
    const updatedData = processFormData(formData);
    const exerciseIndex = mockExercises.findIndex(ex => ex._id === exerciseId);

    if (exerciseIndex === -1) throw new Error("Exercise not found");

    mockExercises[exerciseIndex] = {
        ...mockExercises[exerciseIndex],
        ...updatedData
    };
    return mockExercises[exerciseIndex];
  },
  deleteExercise: async (exerciseId: string): Promise<{ _id: string }> => {
    await delay(1000);
    console.log("API: Deleting exercise with ID:", exerciseId);
    const index = mockExercises.findIndex(ex => ex._id === exerciseId);
    if (index > -1) {
      mockExercises.splice(index, 1);
    }
    return { _id: exerciseId };
  },
};