import axios from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    if (!error.config?.skipErrorToast) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to simulate API delay for development
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Database types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  phone?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  student_code: string;
  phone?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Instructor {
  id: string;
  user_id: string;
  designation: string;
  bio?: string;
  expertise?: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  max_students: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingSchedule {
  id: string;
  course_id: string;
  instructor_id?: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  mode: 'online' | 'offline' | 'hybrid';
  is_recurring: boolean;
  max_enrollments: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
  instructor?: Instructor;
}

export interface Enrollment {
  id: string;
  student_id: string;
  training_schedule_id: string;
  status: 'enrolled' | 'completed' | 'cancelled';
  enrolled_at: string;
  completed_at?: string;
  notes?: string;
  student?: Student;
  training_schedule?: TrainingSchedule;
}

export interface Attendance {
  id: string;
  enrollment_id: string;
  training_schedule_id: string;
  student_id: string;
  is_present: boolean;
  marked_at: string;
  marked_by: string;
  notes?: string;
  enrollment?: Enrollment;
  student?: Student;
}

export interface DashboardStats {
  total_courses: number;
  total_students: number;
  total_instructors: number;
  total_trainings: number;
  upcoming_trainings: number;
  active_enrollments: number;
  top_courses?: Course[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  phone?: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface CreateInstructorRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  designation: string;
  bio?: string;
  expertise?: string[];
  phone?: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  
  register: async (userData: CreateUserRequest) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/profile', userData);
    return response.data;
  },
};

// Courses API
export const coursesAPI = {
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  
  create: async (courseData: Partial<Course>) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },
  
  update: async (id: string, courseData: Partial<Course>) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

// Students API
export const studentsAPI = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  
  create: async (studentData: CreateStudentRequest) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  
  update: async (id: string, studentData: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

// Instructors API
export const instructorsAPI = {
  getAll: async () => {
    const response = await api.get('/instructors');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/instructors/${id}`);
    return response.data;
  },
  
  create: async (instructorData: CreateInstructorRequest) => {
    const response = await api.post('/instructors', instructorData);
    return response.data;
  },
  
  update: async (id: string, instructorData: Partial<Instructor>) => {
    const response = await api.put(`/instructors/${id}`, instructorData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/instructors/${id}`);
    return response.data;
  },
};

// Training Schedules API
export const schedulesAPI = {
  getAll: async () => {
    const response = await api.get('/schedules');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
  
  create: async (scheduleData: Partial<TrainingSchedule>) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },
  
  update: async (id: string, scheduleData: Partial<TrainingSchedule>) => {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },
  
  exportAttendance: async (id: string) => {
    const response = await api.get(`/training/${id}/attendance/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },
  
  getByStudent: async (studentId: string) => {
    const response = await api.get(`/students/${studentId}/enrollments`);
    return response.data;
  },
  
  optIn: async (trainingId: string) => {
    const response = await api.post(`/training/${trainingId}/optin`);
    return response.data;
  },
  
  optOut: async (trainingId: string) => {
    const response = await api.delete(`/training/${trainingId}/optout`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/enrollments/${id}`, { status });
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getByTraining: async (trainingId: string) => {
    const response = await api.get(`/training/${trainingId}/attendance`);
    return response.data;
  },
  
  markAttendance: async (trainingId: string, attendanceData: Array<{
    student_id: string;
    is_present: boolean;
    notes?: string;
  }>) => {
    const response = await api.post(`/training/${trainingId}/attendance`, {
      attendance: attendanceData
    });
    return response.data;
  },
  
  updateAttendance: async (attendanceId: string, data: {
    is_present: boolean;
    notes?: string;
  }) => {
    const response = await api.put(`/attendance/${attendanceId}`, data);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getRecentActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },
};

export default api;