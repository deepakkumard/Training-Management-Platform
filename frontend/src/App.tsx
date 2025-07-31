import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import CourseList from './pages/Courses/CourseList';
import CourseForm from './pages/Courses/CourseForm';
import StudentList from './pages/Students/StudentList';
import StudentForm from './pages/Students/StudentForm';
import InstructorList from './pages/Instructors/InstructorList';
import ScheduleList from './pages/Schedules/ScheduleList';
import ScheduleForm from './pages/Schedules/ScheduleForm';
import AttendanceMarking from './pages/Schedules/AttendanceMarking';
import MyTrainings from './pages/Students/MyTrainings';
import AvailableTrainings from './pages/Students/AvailableTrainings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Course Routes */}
                <Route path="courses" element={
                  <ProtectedRoute roles={['admin', 'instructor']}>
                    <CourseList />
                  </ProtectedRoute>
                } />
                <Route path="courses/new" element={
                  <ProtectedRoute roles={['admin']}>
                    <CourseForm />
                  </ProtectedRoute>
                } />
                <Route path="courses/:id/edit" element={
                  <ProtectedRoute roles={['admin']}>
                    <CourseForm />
                  </ProtectedRoute>
                } />
                
                {/* Student Routes */}
                <Route path="students" element={
                  <ProtectedRoute roles={['admin', 'instructor']}>
                    <StudentList />
                  </ProtectedRoute>
                } />
                <Route path="students/new" element={
                  <ProtectedRoute roles={['admin']}>
                    <StudentForm />
                  </ProtectedRoute>
                } />
                <Route path="students/:id/edit" element={
                  <ProtectedRoute roles={['admin']}>
                    <StudentForm />
                  </ProtectedRoute>
                } />
                
                {/* Instructor Routes */}
                <Route path="instructors" element={
                  <ProtectedRoute roles={['admin', 'instructor']}>
                    <InstructorList />
                  </ProtectedRoute>
                } />
                
                {/* Schedule Routes */}
                <Route path="schedules" element={
                  <ProtectedRoute roles={['admin', 'instructor']}>
                    <ScheduleList />
                  </ProtectedRoute>
                } />
                <Route path="schedules/new" element={
                  <ProtectedRoute roles={['admin', 'instructor']}>
                    <ScheduleForm />
                  </ProtectedRoute>
                } />
                <Route path="schedules/:id/edit" element={
                  <ProtectedRoute roles={['admin', 'instructor']}>
                    <ScheduleForm />
                  </ProtectedRoute>
                } />
                <Route path="schedules/:id/attendance" element={
                  <ProtectedRoute roles={['admin', 'instructor']}>
                    <AttendanceMarking />
                  </ProtectedRoute>
                } />
                
                {/* Student-specific Routes */}
                <Route path="my-trainings" element={
                  <ProtectedRoute roles={['student']}>
                    <MyTrainings />
                  </ProtectedRoute>
                } />
                <Route path="available-trainings" element={
                  <ProtectedRoute roles={['student']}>
                    <AvailableTrainings />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;