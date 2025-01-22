import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ courses: data || [], loading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  createCourse: async (course) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('courses')
        .insert([course]);

      if (error) throw error;

      await get().fetchCourses();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  updateCourse: async (id, course) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('courses')
        .update(course)
        .eq('id', id);

      if (error) throw error;

      await get().fetchCourses();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  deleteCourse: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchCourses();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  enrollInCourse: async (courseId) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('enrolled_courses')
        .insert([{ course_id: courseId }]);

      if (error) throw error;

      set({ loading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));