import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useCourseStore = create((set, get) => ({
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
      set({ error: error.message, loading: false });
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
      set({ error: error.message, loading: false });
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
      set({ error: error.message, loading: false });
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
      set({ error: error.message, loading: false });
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
      set({ error: error.message, loading: false });
    }
  },
}));