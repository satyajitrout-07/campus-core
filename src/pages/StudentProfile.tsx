import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Badge } from '../components/ui/Badge';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  CalendarCheck,
  FileCheck,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface StudentProfileProps {
  studentId: string;
  onBack: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ studentId, onBack }) => {
  const { students, marks, attendance, assignments, submissions, courses } = useData();
  const [activeTab, setActiveTab] = useState<'info' | 'marks' | 'attendance' | 'assignments'>('info');

  const student = students.find((s) => s.id === studentId || s.studentId === studentId) || students[0];

  const studentMarks = marks.filter((m) => m.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentSubmissions = submissions.filter((sub) => sub.studentId === student.id);

  // Performance history mock trend
  const performanceHistory = [
    { exam: 'Sem 1', gpa: 3.65 },
    { exam: 'Sem 2', gpa: 3.70 },
    { exam: 'Sem 3', gpa: 3.82 },
    { exam: 'Sem 4', gpa: 3.78 },
    { exam: 'Sem 5 (Midterm)', gpa: student.gpa || 3.85 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>

      {/* Header Profile Hero Card */}
      <div className="glass-card p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <img
            src={student.avatarUrl}
            alt={student.fullName}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/40 shadow-xl"
          />

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{student.fullName}</h1>
              <Badge variant="brand">Sem {student.semester}</Badge>
              <Badge variant="success">Active Student</Badge>
            </div>

            <p className="text-xs text-blue-200 font-medium">
              {student.departmentName} • ID: <span className="font-mono text-white font-bold">{student.studentId}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                {student.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {student.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                {student.address}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
            <div className="px-3">
              <div className="text-xl font-extrabold text-emerald-400">{student.gpa || 3.85}</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Cumulative GPA</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="px-3">
              <div className="text-xl font-extrabold text-brand-400">{student.attendancePercentage || 94}%</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Attendance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'info'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Overview & Personal Info
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'marks'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Academic Marks & GPA ({studentMarks.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'attendance'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Attendance Log ({studentAttendance.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'assignments'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Submissions ({studentSubmissions.length})
        </button>
      </div>

      {/* Tab 1: Info */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-5 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Student Performance Progression (GPA)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="exam" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[3.0, 4.0]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="gpa" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Gender</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date of Birth</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.departmentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Current Semester</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Semester {student.semester}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Contact Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Marks */}
      {activeTab === 'marks' && (
        <div className="glass-card p-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="p-3">Examination</th>
                <th className="p-3">Course</th>
                <th className="p-3">Marks Obtained</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentMarks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">
                    No examination records entered yet.
                  </td>
                </tr>
              ) : (
                studentMarks.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{m.examName}</td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{m.courseName}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {m.marksObtained} / {m.totalMarks}
                    </td>
                    <td className="p-3 font-semibold text-emerald-600">{m.percentage.toFixed(1)}%</td>
                    <td className="p-3">
                      <Badge variant={m.grade.startsWith('A') ? 'success' : 'warning'}>{m.grade}</Badge>
                    </td>
                    <td className="p-3 text-slate-500 italic">{m.remarks || 'Good job'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Attendance */}
      {activeTab === 'attendance' && (
        <div className="glass-card p-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="p-3">Date</th>
                <th className="p-3">Course</th>
                <th className="p-3">Status</th>
                <th className="p-3">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-400">
                    No attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                studentAttendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{a.date}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{a.courseName}</td>
                    <td className="p-3">
                      <Badge variant={a.status === 'Present' ? 'success' : a.status === 'Late' ? 'warning' : 'danger'}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500">{a.markedBy || 'Faculty'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Submissions */}
      {activeTab === 'assignments' && (
        <div className="glass-card p-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="p-3">Submission Date</th>
                <th className="p-3">File Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Grade Score</th>
                <th className="p-3">Student Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No assignment submissions made yet.
                  </td>
                </tr>
              ) : (
                studentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{sub.submissionDate}</td>
                    <td className="p-3 text-brand-600 font-medium">{sub.fileName}</td>
                    <td className="p-3">
                      <Badge variant={sub.status === 'Graded' ? 'success' : 'info'}>{sub.status}</Badge>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">{sub.gradeObtained ? `${sub.gradeObtained}/100` : 'Pending'}</td>
                    <td className="p-3 text-slate-500">{sub.notes || 'None'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
