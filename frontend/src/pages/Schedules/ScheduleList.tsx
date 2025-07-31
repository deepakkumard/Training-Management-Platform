import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schedulesAPI, TrainingSchedule } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Plus, Edit, Trash2, Search, MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ScheduleList: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await schedulesAPI.getAll();
      const schedulesData = response.data || response || [];
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch training schedules');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training schedule?')) return;
    try {
      await schedulesAPI.delete(id);
      setSchedules(schedules.filter((s) => s.id !== id));
      toast.success('Training schedule deleted successfully');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete training schedule');
    }
  };

  const handleExportAttendance = async (id: string, title: string) => {
    try {
      const blob = await schedulesAPI.exportAttendance(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendance.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Attendance report downloaded successfully');
    } catch (error) {
      console.error('Error exporting attendance:', error);
      toast.error('Failed to export attendance report');
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    if (!schedule) return false;
    const matchesSearch =
      schedule.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.instructor?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMode = !selectedMode || schedule.mode === selectedMode;
    return matchesSearch && matchesMode;
  });

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'online':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = (startTime: string) => new Date(startTime) > new Date();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Schedules</h1>
            <p className="mt-1 text-sm text-gray-600">Manage training sessions and schedules</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Schedules</h1>
          <p className="mt-1 text-sm text-gray-600">Manage training sessions and schedules</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'instructor') && (
          <Link
            to="/schedules/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search schedules..."
              className="pl-10 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
          >
            <option value="">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedules.map((schedule) => (
          <div key={schedule.id} className="bg-white rounded-lg shadow hover:shadow-lg">
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <Calendar className="text-blue-600 h-6 w-6" />
                <div className="flex gap-2">
                  {isUpcoming(schedule.start_time) && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Upcoming</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getModeColor(schedule.mode)}`}>
                    {schedule.mode}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold">{schedule.title}</h3>
              <p className="text-sm text-gray-600">{schedule.course?.title}</p>
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {format(new Date(schedule.start_time), 'PPP p')} – {format(new Date(schedule.end_time), 'p')}
                </div>
                {schedule.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {schedule.location}
                  </div>
                )}
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Max: {schedule.max_enrollments}
                </div>
                {schedule.instructor?.user?.name && (
                  <div className="flex items-center">
                    <span className="font-medium">Instructor:</span>
                    <span className="ml-1">{schedule.instructor.user.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
              <Link
                to={`/schedules/${schedule.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View Details →
              </Link>
              <div className="flex gap-2">
                {user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => handleExportAttendance(schedule.id, schedule.title)}
                      className="text-xs text-gray-500 hover:text-blue-600"
                      title="Export Attendance"
                    >
                      Export PDF
                    </button>
                    <Link to={`/schedules/${schedule.id}/edit`} className="text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(schedule.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredSchedules.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No training schedules found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedMode ? 'Try adjusting your search filters.' : 'Get started by creating a new schedule.'}
          </p>
          {(user?.role === 'admin' || user?.role === 'instructor') && !searchTerm && !selectedMode && (
            <div className="mt-6">
              <Link
                to="/schedules/new"
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
