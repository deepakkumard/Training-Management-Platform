import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instructorsAPI, Instructor } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Plus, Edit, Trash2, Search, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const InstructorList: React.FC = () => {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await instructorsAPI.getAll();
      const instructorsData = response.data || response || [];
      console.log('Fetched instructors:', instructorsData);
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to fetch instructors');
      setInstructors([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instructor?')) return;

    try {
      await instructorsAPI.delete(id);
      setInstructors(instructors.filter(instructor => instructor.id !== id));
      toast.success('Instructor deleted successfully');
    } catch (error) {
      console.error('Error deleting instructor:', error);
      toast.error('Failed to delete instructor');
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    if (!instructor) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (instructor.designation && instructor.designation.toLowerCase().includes(searchLower)) ||
      (instructor.user?.name && instructor.user.name.toLowerCase().includes(searchLower)) ||
      (instructor.user?.email && instructor.user.email.toLowerCase().includes(searchLower)) ||
      (instructor.bio && instructor.bio.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructors</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage instructor profiles and assignments
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructors</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage instructor profiles and assignments
          </p>
        </div>
        {user?.role === 'admin' && (
          <Link
            to="/instructors/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Instructor
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search instructors by name, email, designation, or bio..."
            className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor) => (
          <div key={instructor.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                {user?.role === 'admin' && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/instructors/${instructor.id}/edit`}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(instructor.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {instructor.user?.name || 'N/A'}
              </h3>
              
              <p className="text-sm text-blue-600 font-medium mb-3">
                {instructor.designation}
              </p>
              
              {instructor.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {instructor.bio}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500">
                {instructor.user?.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{instructor.user.email}</span>
                  </div>
                )}
                
                {instructor.user?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{instructor.user.phone}</span>
                  </div>
                )}
              </div>
              
              {instructor.expertise && instructor.expertise.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {instructor.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {instructor.expertise.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{instructor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  instructor.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {instructor.status ? 'Active' : 'Inactive'}
                </span>
                
                <Link
                  to={`/instructors/${instructor.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No instructors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'Get started by adding a new instructor.'}
          </p>
          {user?.role === 'admin' && !searchTerm && (
            <div className="mt-6">
              <Link
                to="/instructors/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Instructor
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorList;