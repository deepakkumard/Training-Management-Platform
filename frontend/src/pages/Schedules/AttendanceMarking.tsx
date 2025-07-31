import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attendanceAPI, schedulesAPI, TrainingSchedule, Attendance } from '../../lib/api';
import { ArrowLeft, Save, Users, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AttendanceMarking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState<TrainingSchedule | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, {
    is_present: boolean;
    notes: string;
  }>>({});

  useEffect(() => {
    if (id) {
      fetchScheduleAndAttendance();
    }
  }, [id]);

  const fetchScheduleAndAttendance = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [scheduleResponse, attendanceResponse] = await Promise.all([
        schedulesAPI.getById(id),
        attendanceAPI.getByTraining(id).catch(() => ({ data: [] }))
      ]);

      const scheduleData = scheduleResponse.data || scheduleResponse;
      const attendanceList = attendanceResponse.data || [];

      setSchedule(scheduleData);
      setAttendance(attendanceList);

      // Initialize attendance data
      const initialData: Record<string, { is_present: boolean; notes: string }> = {};
      attendanceList.forEach((att: Attendance) => {
        if (att.student?.id) {
          initialData[att.student.id] = {
            is_present: att.is_present,
            notes: att.notes || ''
          };
        }
      });
      setAttendanceData(initialData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch attendance data');
      navigate('/schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, field: 'is_present' | 'notes', value: boolean | string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!id) return;

    setSaving(true);
    try {
      const attendanceArray = Object.entries(attendanceData).map(([studentId, data]) => ({
        student_id: studentId,
        is_present: data.is_present,
        notes: data.notes
      }));

      await attendanceAPI.markAttendance(id, attendanceArray);
      toast.success('Attendance marked successfully');
      navigate('/schedules');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const markAllPresent = () => {
    const updatedData: Record<string, { is_present: boolean; notes: string }> = {};
    attendance.forEach((att) => {
      if (att.student?.id) {
        updatedData[att.student.id] = {
          is_present: true,
          notes: attendanceData[att.student.id]?.notes || ''
        };
      }
    });
    setAttendanceData(updatedData);
  };

  const markAllAbsent = () => {
    const updatedData: Record<string, { is_present: boolean; notes: string }> = {};
    attendance.forEach((att) => {
      if (att.student?.id) {
        updatedData[att.student.id] = {
          is_present: false,
          notes: attendanceData[att.student.id]?.notes || ''
        };
      }
    });
    setAttendanceData(updatedData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Training schedule not found</p>
      </div>
    );
  }

  const presentCount = Object.values(attendanceData).filter(data => data.is_present).length;
  const totalStudents = attendance.length;

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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mark Attendance
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {schedule.title} - {format(new Date(schedule.start_time), 'PPP p')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <Users className="inline h-4 w-4 mr-1" />
            {presentCount} / {totalStudents} Present
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="flex space-x-3">
            <button
              onClick={markAllPresent}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Student Attendance</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {attendance.map((att) => {
            if (!att.student?.id) return null;
            
            const studentId = att.student.id;
            const studentData = attendanceData[studentId] || { is_present: false, notes: '' };
            
            return (
              <div key={studentId} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {att.student.user?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {att.student.student_code} • {att.student.user?.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${studentId}`}
                              checked={studentData.is_present}
                              onChange={() => handleAttendanceChange(studentId, 'is_present', true)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-green-700 dark:text-green-400">Present</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${studentId}`}
                              checked={!studentData.is_present}
                              onChange={() => handleAttendanceChange(studentId, 'is_present', false)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-red-700 dark:text-red-400">Absent</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes (optional)
                      </label>
                      <input
                        type="text"
                        value={studentData.notes}
                        onChange={(e) => handleAttendanceChange(studentId, 'notes', e.target.value)}
                        placeholder="Add notes about attendance..."
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {attendance.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No enrolled students</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            There are no students enrolled in this training session.
          </p>
        </div>
      )}

      {/* Save Button */}
      {attendance.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;