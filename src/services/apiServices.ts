// services/apiService.ts
import { DashboardAnalytics, Exercise, UserWithAnalytics, RehabPlan, Notification, ContentPage } from '@/lib/types';
import { mockDashboardData, mockUsers, mockExercises, mockPlans, mockNotifications, mockContentPages } from '@/lib/mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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
    console.log("Fetching exercises...");
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
  }
};