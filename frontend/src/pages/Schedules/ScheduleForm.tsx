import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { schedulesAPI, coursesAPI, instructorsAPI, Course, Instructor } from '../../lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ScheduleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [formData, setFormData] = useState({
    course_id: '',
    instructor_id: '',
    title: '',
    start_time: '',
    end_time: '',
    location: '',
    mode: 'offline' as 'online' | 'offline' | 'hybrid',
    is_recurring: false,
    max_enrollments: 30,
  });

    const fetchSchedule = useCallback(async (scheduleId: string) => {
    try {
        setLoading(true);
        const response = await schedulesAPI.getById(scheduleId);
        const schedule = response.data || response;

        const startTime = new Date(schedule.start_time);
        const endTime = new Date(schedule.end_time);

        setFormData({
        course_id: schedule.course_id || '',
        instructor_id: schedule.instructor_id || '',
        title: schedule.title || '',
        start_time: startTime.toISOString().slice(0, 16),
        end_time: endTime.toISOString().slice(0, 16),
        location: schedule.location || '',
        mode: schedule.mode || 'offline',
        is_recurring: schedule.is_recurring || false,
        max_enrollments: schedule.max_enrollments || 30,
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        toast.error('Failed to fetch schedule details');
        navigate('/schedules');
    } finally {
        setLoading(false);
    }
    }, [navigate]);


    const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await instructorsAPI.getAll();
      setInstructors(response.data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
    if (isEditing && id) {
      fetchSchedule(id);
    }
  }, [id, isEditing, fetchSchedule]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'max_enrollments' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };

      if (isEditing && id) {
        await schedulesAPI.update(id, submitData);
        toast.success('Training schedule updated successfully');
      } else {
        await schedulesAPI.create(submitData);
        toast.success('Training schedule created successfully');
      }
      navigate('/schedules');
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} training schedule`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/schedules')}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Training Schedule' : 'Create New Training Schedule'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {isEditing ? 'Update training schedule information' : 'Add a new training schedule to the platform'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Training Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter training title"
              />
            </div>

            <div>
              <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Course *
              </label>
              <select
                name="course_id"
                id="course_id"
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.course_id}
                onChange={handleChange}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Instructor
              </label>
              <select
                name="instructor_id"
                id="instructor_id"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.instructor_id}
                onChange={handleChange}
              >
                <option value="">Select an instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.user?.name} - {instructor.designation}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="start_time"
                id="start_time"
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Time *
              </label>
              <input
                type="datetime-local"
                name="end_time"
                id="end_time"
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Training Mode *
              </label>
              <select
                name="mode"
                id="mode"
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.mode}
                onChange={handleChange}
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="max_enrollments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum Enrollments *
              </label>
              <input
                type="number"
                name="max_enrollments"
                id="max_enrollments"
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.max_enrollments}
                onChange={handleChange}
                placeholder="30"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location (leave empty for online sessions)"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_recurring"
                  id="is_recurring"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.is_recurring}
                  onChange={handleChange}
                />
                <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  This is a recurring training session
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/schedules')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Update Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;