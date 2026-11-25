import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MarkRecord } from '../types';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { Award, Plus, Search, Filter, BookOpen, User, CheckCircle, TrendingUp } from 'lucide-react';

export const Marks: React.FC = () => {
  const { marks, courses, students, addMarkRecord } = useData();
  const { role } = useAuth();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('All');
  const [selectedExam, setSelectedExam] = useState<string>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || 'stu-1',
    courseId: courses[0]?.id || 'crs-101',
    examName: 'Midterm Exam',
    marksObtained: 85,
    totalMarks: 100,
    remarks: 'Great performance and analytical precision.',
  });

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === formData.studentId);
    const course = courses.find((c) => c.id === formData.courseId);

    addMarkRecord({
      studentId: formData.studentId,
      studentName: student?.fullName || 'Student',
      courseId: formData.courseId,
      courseName: course?.name || 'Course',
      examName: formData.examName,
      marksObtained: formData.marksObtained,
      totalMarks: formData.totalMarks,
      remarks: formData.remarks,
    });

    setToastMessage(`Marks for ${student?.fullName || 'Student'} recorded successfully!`);
    setIsAddModalOpen(false);
  };

  const filteredMarks = useMemo(() => {
    return marks.filter((m) => {
      const matchesCourse = selectedCourseId === 'All' || m.courseId === selectedCourseId;
      const matchesExam = selectedExam === 'All' || m.examName === selectedExam;
      return matchesCourse && matchesExam;
    });
  }, [marks, selectedCourseId, selectedExam]);

  // Statistics calculation
  const totalEntries = filteredMarks.length;
  const avgScore = totalEntries
    ? Math.round(filteredMarks.reduce((sum, m) => sum + m.percentage, 0) / totalEntries)
    : 0;
  const topScore = totalEntries ? Math.max(...filteredMarks.map((m) => m.percentage)) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <Toast message={toastMessage || ''} isOpen={Boolean(toastMessage)} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Marks & Examination Portal</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Input examination scores, calculate total marks, percentage, grade point average, and semester rankings
          </p>
        </div>

        {(role === 'Admin' || role === 'Teacher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Marks</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Class Average</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{avgScore}%</div>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/50 text-brand-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Highest Score</div>
            <div className="text-xl font-bold text-brand-600 dark:text-brand-400">{topScore}%</div>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pass Rate</div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">96.8%</div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter By Course:</span>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500">Examination:</span>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="All">All Exams</option>
            <option value="Midterm Exam">Midterm Exam</option>
            <option value="Final Exam">Final Exam</option>
            <option value="Quiz 1">Quiz 1</option>
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Examination</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Percentage</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredMarks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No examination records found for selected filters.
                  </td>
                </tr>
              ) : (
                filteredMarks.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {m.studentName}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {m.courseName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{m.examName}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {m.marksObtained} / {m.totalMarks}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {m.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={m.grade.startsWith('A') ? 'success' : m.grade === 'B' ? 'brand' : 'warning'}>
                        {m.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic">{m.remarks || 'Recorded'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Marks Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Examination Marks"
        maxWidth="md"
      >
        <form onSubmit={handleSaveMarks} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student Candidate
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentId} - {s.departmentName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Course
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Exam Name / Title
            </label>
            <input
              type="text"
              required
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              placeholder="e.g. Midterm Exam, Quiz 2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marks Obtained
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={formData.marksObtained}
                onChange={(e) => setFormData({ ...formData, marksObtained: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Marks
              </label>
              <input
                type="number"
                min={10}
                max={100}
                required
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Remarks / Feedback
            </label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              placeholder="Optional remarks"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
            >
              Save Examination Score
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
