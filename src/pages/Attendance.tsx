import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';
import { Calendar, CheckCircle2, XCircle, Clock, Save, UserCheck, Search, Filter } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { courses, students, attendance, markAttendance } = useData();
  const { user, role } = useAuth();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'crs-101');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected course details
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Eligible students enrolled in the selected course's department & semester
  const courseStudents = useMemo(() => {
    return students.filter(
      (s) => s.departmentId === selectedCourse.departmentId && s.semester === selectedCourse.semester
    );
  }, [students, selectedCourse]);

  // Local state for interactive marking grid: studentId -> 'Present' | 'Absent' | 'Late'
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});

  // Sync initial state when course or date changes
  React.useEffect(() => {
    const initialState: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    courseStudents.forEach((student) => {
      const existing = attendance.find(
        (a) => a.studentId === student.id && a.courseId === selectedCourseId && a.date === sessionDate
      );
      initialState[student.id] = existing ? existing.status : 'Present';
    });
    setAttendanceState(initialState);
  }, [selectedCourseId, sessionDate, courseStudents, attendance]);

  const handleToggleStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    courseStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceState(updated);
  };

  const handleSaveSession = () => {
    const recordsToSave = courseStudents.map((s) => ({
      studentId: s.id,
      studentName: s.fullName,
      courseId: selectedCourseId,
      courseName: selectedCourse.name,
      date: sessionDate,
      status: attendanceState[s.id] || 'Present',
      markedBy: user?.fullName || 'Faculty Member',
    }));

    markAttendance(recordsToSave);
    setToastMessage(`Attendance for ${selectedCourse.code} saved successfully for ${sessionDate}!`);
  };

  // Stats calculation
  const totalCount = courseStudents.length;
  const presentCount = Object.values(attendanceState).filter((st) => st === 'Present').length;
  const lateCount = Object.values(attendanceState).filter((st) => st === 'Late').length;
  const absentCount = Object.values(attendanceState).filter((st) => st === 'Absent').length;
  const attendanceRate = totalCount ? Math.round(((presentCount + lateCount * 0.5) / totalCount) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <Toast message={toastMessage || ''} isOpen={Boolean(toastMessage)} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Attendance Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conduct daily classroom register, record absences, and track monthly attendance percentages
          </p>
        </div>

        {(role === 'Admin' || role === 'Teacher') && (
          <button
            onClick={handleSaveSession}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance Register</span>
          </button>
        )}
      </div>

      {/* Session Config Bar */}
      <div className="glass-card p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Select Course Session
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-slate-100"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name} (Sem {c.semester})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lecture Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Quick Bulk Toggle */}
        <div className="flex items-center gap-2 pt-4 md:pt-0">
          <button
            onClick={() => handleMarkAll('Present')}
            className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-200/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={() => handleMarkAll('Absent')}
            className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 rounded-xl text-xs font-semibold border border-rose-200/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Mark All Absent</span>
          </button>
        </div>
      </div>

      {/* Realtime Attendance Rate KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Roster</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalCount}</span>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider block">Present</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</span>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider block">Late Arrivals</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{lateCount}</span>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block">Session Rate</span>
          <span className="text-xl font-bold text-brand-600 dark:text-brand-400">{attendanceRate}%</span>
        </div>
      </div>

      {/* Student Roster Marking Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Classroom Roster - {selectedCourse.name} ({selectedCourse.code})
          </h3>
          <span className="text-xs text-slate-500">Instructor: {selectedCourse.teacherName || 'Faculty'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Historical Rate</th>
                <th className="py-3.5 px-4 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {courseStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No students currently enrolled in this department semester.
                  </td>
                </tr>
              ) : (
                courseStudents.map((s) => {
                  const currentStatus = attendanceState[s.id] || 'Present';
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatarUrl}
                            alt={s.fullName}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{s.fullName}</div>
                            <div className="text-[10px] text-slate-400">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {s.studentId}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{s.departmentName}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-600">{s.attendancePercentage || 92}%</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(s.id, 'Present')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(s.id, 'Late')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(s.id, 'Absent')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
