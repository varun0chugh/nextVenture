import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, loading, error, fetchCourses, deleteCourse } = useCourseStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }
      
      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setIsAdmin(data.role === 'admin');
          setIsInstructor(data.role === 'instructor' || data.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking role:', error);
      } finally {
        setRoleLoading(false);
      }
    };

    checkRole();
    fetchCourses();
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error loading courses: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="mt-2 text-gray-300">
              Welcome back, {user.email}
            </p>
          </div>
          {isInstructor && (
            <button
              onClick={() => {/* Open course creation modal */}}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Course
            </button>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Courses Available</h3>
            <p className="text-gray-300">
              {isInstructor 
                ? "Start by creating your first course!"
                : "Check back later for available courses."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <img
                  src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-400">${course.price}</span>
                    <div className="flex space-x-2">
                      {isInstructor && (
                        <>
                          <button
                            onClick={() => {/* Open edit modal */}}
                            className="p-2 text-gray-300 hover:text-blue-400 transition-colors"
                            title="Edit course"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                            title="Delete course"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {/* View course content */}}
                        className="p-2 text-gray-300 hover:text-green-400 transition-colors"
                        title="View course"
                      >
                        <BookOpen className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;