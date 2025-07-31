import React, { useState, useEffect } from 'react';
import { schedulesAPI, enrollmentsAPI, TrainingSchedule } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, BookOpen, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AvailableTrainings: React.FC = () => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<TrainingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [enrollingIds, setEnrollingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAvailableTrainings();
  }, []);

  const fetchAvailableTrainings = async () => {
    setLoading(true);
    try {
      const response = await schedulesAPI.getAll();
      // Filter for upcoming trainings only
      const upcomingTrainings = (response.data || response || []).filter((training: TrainingSchedule) => 
        training && training.start_time && new Date(training.start_time) > new Date() && training.status
      );
      console.log('Fetched available trainings:', upcomingTrainings);
      setTrainings(upcomingTrainings);
    } catch (error) {
      console.error('Error fetching available trainings:', error);
      toast.error('Failed to fetch available trainings');
      setTrainings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOptIn = async (trainingId: string) => {
    setEnrollingIds(prev => new Set(prev).add(trainingId));
    
    try {
      await enrollmentsAPI.optIn(trainingId);
      toast.success('Successfully enrolled in training!');
      // Optionally refresh the list or update the UI to show enrollment status
    } catch (error) {
      console.error('Error enrolling in training:', error);
      toast.error('Failed to enroll in training');
    } finally {
      setEnrollingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(trainingId);
        return newSet;
      });
    }
  };

  const filteredTrainings = trainings.filter(training => {
    if (!training) return false;
    const matchesSearch = (training.title && training.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (training.course?.title && training.course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (training.instructor?.user?.name && training.instructor.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMode = !selectedMode || training.mode === selectedMode;
    
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Trainings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse and enroll in upcoming training sessions
          </p>
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Trainings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse and enroll in upcoming training sessions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trainings..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      </div>

      {/* Training Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainings.map((training) => (
          <div key={training.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getModeColor(training.mode)}`}>
                  {training.mode}
                </span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {training.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {training.course?.title}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(training.start_time), 'PPP p')} - {format(new Date(training.end_time), 'p')}
                  </span>
                </div>
                
                {training.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{training.location}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Max: {training.max_enrollments}</span>
                </div>
                
                {training.instructor?.user?.name && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{training.instructor.user.name}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleOptIn(training.id)}
                disabled={enrollingIds.has(training.id)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrollingIds.has(training.id) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {enrollingIds.has(training.id) ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No available trainings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedMode
              ? 'Try adjusting your search filters.'
              : 'There are no upcoming trainings available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableTrainings;