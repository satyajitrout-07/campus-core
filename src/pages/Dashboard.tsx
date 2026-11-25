import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  UserPlus,
  CalendarCheck,
  Award,
  FilePlus,
  Megaphone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardProps {
  onNavigate: (pageId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { stats, announcements, assignments, departments, students } = useData();
  const { user, role } = useAuth();

  // Mock chart data derived dynamically
  const attendanceTrendData = [
    { day: 'Mon', percentage: 92 },
    { day: 'Tue', percentage: 94 },
    { day: 'Wed', percentage: 89 },
    { day: 'Thu', percentage: 95 },
    { day: 'Fri', percentage: 91 },
    { day: 'Sat', percentage: 88 },
  ];

  const gradeDistributionData = [
    { grade: 'A+ (90%+)', count: 8 },
    { grade: 'A (80-89%)', count: 11 },
    { grade: 'B (70-79%)', count: 4 },
    { grade: 'C (60-69%)', count: 2 },
  ];

  const deptDistributionData = departments.map((d) => {
    const count = students.filter((s) => s.departmentId === d.id).length;
    return { name: d.code, fullName: d.name, value: count || 4 };
  });

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Top Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-brand-600 to-indigo-700 text-white border-none shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={user?.avatarUrl || '/satyajit.jpg'}
                alt={user?.fullName || 'Owner Avatar'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-white/30 shadow-lg shadow-black/20"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" title="Active Now" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wider uppercase mb-1">
                Fall Semester 2026 Active
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.fullName || 'Academic Portal'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                You are signed in as <strong className="font-semibold text-white">{role}</strong>. Here is your real-time academic overview and institutional performance metrics.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {role === 'Admin' && (
              <button
                onClick={() => onNavigate('students')}
                className="px-4 py-2 text-xs font-semibold bg-white text-brand-700 hover:bg-blue-50 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            )}
            {(role === 'Admin' || role === 'Teacher') && (
              <button
                onClick={() => onNavigate('attendance')}
                className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Mark Attendance</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value={stats.totalStudents}
          icon={Users}
          trend="+8% this term"
          trendType="positive"
          color="blue"
          subtitle="Active degree candidates"
        />
        <StatCard
          title="Faculty Members"
          value={stats.totalTeachers}
          icon={GraduationCap}
          trend="100% active"
          trendType="positive"
          color="emerald"
          subtitle="4 Departments"
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          trend="12 Offered"
          trendType="neutral"
          color="purple"
          subtitle="Semester 1 to 8"
        />
        <StatCard
          title="Average Attendance"
          value={`${stats.avgAttendance}%`}
          icon={TrendingUp}
          trend="+2.4% vs last week"
          trendType="positive"
          color="indigo"
          subtitle="Overall institutional rate"
        />
      </div>

      {/* Quick Action Drawer */}
      <div className="glass-card p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Quick Administrative Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-all text-xs font-semibold group"
          >
            <UserPlus className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
            <span>Manage Students</span>
          </button>
          <button
            onClick={() => onNavigate('teachers')}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-all text-xs font-semibold group"
          >
            <GraduationCap className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>Faculty Directory</span>
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-all text-xs font-semibold group"
          >
            <CalendarCheck className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span>Daily Attendance</span>
          </button>
          <button
            onClick={() => onNavigate('marks')}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-all text-xs font-semibold group"
          >
            <Award className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            <span>Marks Entry</span>
          </button>
          <button
            onClick={() => onNavigate('assignments')}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-all text-xs font-semibold group"
          >
            <FilePlus className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Area Chart */}
        <div className="glass-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Weekly Attendance Rate (%)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily student classroom presence performance
              </p>
            </div>
            <Badge variant="success">+2.4% Increase</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="percentage" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#attendanceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Bar Chart */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Grade Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Semester exam performance distribution</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Department distribution, Recent Announcements, Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Ratio Pie */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Department Enrolments</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Student count by specialization</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {deptDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {deptDistributionData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Announcements</h3>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-semibold flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((anc) => (
              <div key={anc.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate pr-2">{anc.title}</h4>
                  <Badge variant={anc.priority === 'High' ? 'danger' : anc.priority === 'Medium' ? 'warning' : 'neutral'}>
                    {anc.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{anc.description}</p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>By {anc.publishedBy}</span>
                  <span>{anc.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Due Dates</h3>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-semibold flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map((asg) => (
              <div key={asg.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{asg.title}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Due {asg.dueDate}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{asg.courseName}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Points: {asg.totalPoints}</span>
                  <span>Submissions: {asg.submissionCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
