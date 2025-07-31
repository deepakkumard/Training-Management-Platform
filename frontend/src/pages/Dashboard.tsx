import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI, DashboardStats } from '../lib/api';
import {
  BookOpen,
  Users,
  Calendar,
  GraduationCap,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivity().catch(() => ({ data: [] })) // Fallback if activity endpoint doesn't exist
      ]);
      
      console.log('Dashboard stats:', statsResponse);
      console.log('Dashboard activity:', activityResponse);
      
      setStats(statsResponse);
      setRecentActivity(activityResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default stats on error
      setStats({
        total_courses: 0,
        total_students: 0,
        total_instructors: 0,
        total_trainings: 0,
        upcoming_trainings: 0,
        active_enrollments: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your training platform today.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Courses',
      value: stats?.total_courses || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      roles: ['admin', 'instructor'],
    },
    {
      name: 'Total Students',
      value: stats?.total_students || 0,
      icon: Users,
      color: 'bg-green-500',
      roles: ['admin', 'instructor'],
    },
    {
      name: 'Total Instructors',
      value: stats?.total_instructors || 0,
      icon: GraduationCap,
      color: 'bg-purple-500',
      roles: ['admin'],
    },
    {
      name: 'Total Trainings',
      value: stats?.total_trainings || 0,
      icon: Calendar,
      color: 'bg-orange-500',
      roles: ['admin', 'instructor'],
    },
    {
      name: 'Upcoming Trainings',
      value: stats?.upcoming_trainings || 0,
      icon: Clock,
      color: 'bg-teal-500',
      roles: ['admin', 'instructor', 'student'],
    },
    {
      name: 'Active Enrollments',
      value: stats?.active_enrollments || 0,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      roles: ['admin', 'instructor', 'student'],
    },
  ];

  const filteredStats = statCards.filter(stat => 
    user?.role && stat.roles.includes(user.role)
  );

  // Sample data for charts (in real app, this would come from API)
  const monthlyData = [
    { month: 'Jan', enrollments: 45, completions: 40 },
    { month: 'Feb', enrollments: 52, completions: 48 },
    { month: 'Mar', enrollments: 48, completions: 45 },
    { month: 'Apr', enrollments: 61, completions: 55 },
    { month: 'May', enrollments: 55, completions: 52 },
    { month: 'Jun', enrollments: 67, completions: 60 },
  ];

  const courseDistribution = [
    { name: 'Technical Skills', value: 35, color: '#3B82F6' },
    { name: 'Soft Skills', value: 25, color: '#10B981' },
    { name: 'Leadership', value: 20, color: '#F59E0B' },
    { name: 'Compliance', value: 15, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#6B7280' },
  ];

  // Default activity if API doesn't provide it
  const defaultActivity = [
    {
      content: 'New student John Doe enrolled in React Development course',
      time: '2 hours ago',
      type: 'enrollment',
    },
    {
      content: 'Training session "Advanced JavaScript" completed successfully',
      time: '4 hours ago',
      type: 'completion',
    },
    {
      content: 'New course "Project Management" created by Sarah Wilson',
      time: '6 hours ago',
      type: 'course',
    },
    {
      content: 'Training schedule updated for "Web Development Bootcamp"',
      time: '8 hours ago',
      type: 'schedule',
    },
  ];

  const activityData = recentActivity.length > 0 ? recentActivity : defaultActivity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your training platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className={`absolute ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {(user?.role === 'admin' || user?.role === 'instructor') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completions" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Course Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Course Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Courses (if available) */}
      {stats?.top_courses && stats.top_courses.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Top Courses
            </h3>
            <div className="space-y-3">
              {stats.top_courses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.category}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.duration_hours}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {activityData.map((activity, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== activityData.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <Calendar className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.content}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;