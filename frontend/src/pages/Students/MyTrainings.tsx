import React, { useState, useEffect } from 'react';
import { enrollmentsAPI, Enrollment } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyTrainings: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'student') {
      fetchMyEnrollments();
    }
  }, [user]);

  const fetchMyEnrollments = async () => {
    setLoading(true);
    try {
      const response = await enrollmentsAPI.getAll();
      const enrollmentsData = response.data || response || [];
      console.log('Fetched enrollments:', enrollmentsData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to fetch your trainings');
      setEnrollments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOptOut = async (trainingId: string) => {
    if (!confirm('Are you sure you want to opt out of this training?')) return;

    try {
      await enrollmentsAPI.optOut(trainingId);
      await fetchMyEnrollments(); // Refresh the list
      toast.success('Successfully opted out of training');
    } catch (error) {
      console.error('Error opting out:', error);
      toast.error('Failed to opt out of training');
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (!enrollment) return false;
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trainings</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your training enrollments
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
        <h1 className="text-2xl font-bold text-gray-900">My Trainings</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage your training enrollments
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'all', label: 'All Trainings' },
              { key: 'enrolled', label: 'Enrolled' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Enrollments List */}
        <div className="divide-y divide-gray-200">
          {filteredEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(enrollment.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {enrollment.training_schedule?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {enrollment.training_schedule?.course?.title}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {enrollment.training_schedule?.start_time && (
                          <span>
                            {format(new Date(enrollment.training_schedule.start_time), 'PPP p')}
                          </span>
                        )}
                      </div>
                      
                      {enrollment.training_schedule?.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{enrollment.training_schedule.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span className="capitalize">{enrollment.training_schedule?.mode}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Enrolled: {format(new Date(enrollment.enrolled_at), 'PPP')}
                      {enrollment.completed_at && (
                        <span className="ml-4">
                          Completed: {format(new Date(enrollment.completed_at), 'PPP')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.status)}`}>
                    {enrollment.status}
                  </span>
                  
                  {enrollment.status === 'enrolled' && (
                    <button
                      onClick={() => handleOptOut(enrollment.training_schedule_id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Opt Out
                    </button>
                  )}
                </div>
              </div>
              
              {enrollment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Notes:</strong> {enrollment.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No trainings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't enrolled in any trainings yet."
                : `No ${filter} trainings found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrainings;