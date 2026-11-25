import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Assignment } from '../types';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { FileCheck, Plus, Upload, Calendar, Clock, Paperclip, CheckCircle2, UserCheck } from 'lucide-react';

export const Assignments: React.FC = () => {
  const { assignments, courses, submissions, addAssignment, submitAssignment } = useData();
  const { user, role } = useAuth();

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    courseId: courses[0]?.id || 'crs-101',
    dueDate: '2026-09-25',
    attachmentName: 'Assignment_Brief.pdf',
    totalPoints: 100,
  });

  const [studentSubmitData, setStudentSubmitData] = useState({
    fileName: 'My_Homework_Submission.zip',
    notes: 'Completed all required algorithm proofs and unit tests.',
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === createFormData.courseId);

    addAssignment({
      title: createFormData.title,
      description: createFormData.description,
      courseId: createFormData.courseId,
      courseName: course?.name || 'Course',
      teacherId: user?.id || 'tch-1',
      dueDate: createFormData.dueDate,
      attachmentName: createFormData.attachmentName,
      totalPoints: createFormData.totalPoints,
    });

    setToastMessage(`Assignment "${createFormData.title}" created successfully!`);
    setIsCreateModalOpen(false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    submitAssignment({
      assignmentId: submittingAssignment.id,
      studentId: user?.studentId || 'stu-1',
      studentName: user?.fullName || 'Alex Rivera',
      fileName: studentSubmitData.fileName,
      notes: studentSubmitData.notes,
    });

    setToastMessage(`Submitted "${submittingAssignment.title}" successfully!`);
    setSubmittingAssignment(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <Toast message={toastMessage || ''} isOpen={Boolean(toastMessage)} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Assignments Portal</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create course assignments, set submission deadlines, and manage student homework files
          </p>
        </div>

        {(role === 'Admin' || role === 'Teacher') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        )}
      </div>

      {/* Assignments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((asg) => {
          const userHasSubmitted = submissions.some(
            (sub) => sub.assignmentId === asg.id && (sub.studentId === user?.studentId || sub.studentId === 'stu-1')
          );

          return (
            <div key={asg.id} className="glass-card p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge variant="brand">{asg.courseName}</Badge>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Due {asg.dueDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{asg.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{asg.description}</p>

                {asg.attachmentName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Paperclip className="w-3.5 h-3.5 text-brand-500" />
                    <span>{asg.attachmentName}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Points: {asg.totalPoints}</span>

                {role === 'Student' ? (
                  userHasSubmitted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => setSubmittingAssignment(asg)}
                      className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  )
                ) : (
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Submissions: <strong className="text-brand-600">{asg.submissionCount || 0}</strong>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={createFormData.title}
              onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              placeholder="e.g. Graph Algorithms & Trees Implementation"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Course
            </label>
            <select
              value={createFormData.courseId}
              onChange={(e) => setCreateFormData({ ...createFormData, courseId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={createFormData.dueDate}
                onChange={(e) => setCreateFormData({ ...createFormData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Points
              </label>
              <input
                type="number"
                min={10}
                max={200}
                required
                value={createFormData.totalPoints}
                onChange={(e) => setCreateFormData({ ...createFormData, totalPoints: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Instructions & Problem Description
            </label>
            <textarea
              rows={3}
              required
              value={createFormData.description}
              onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attachment Document Name
            </label>
            <input
              type="text"
              value={createFormData.attachmentName}
              onChange={(e) => setCreateFormData({ ...createFormData, attachmentName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Assignment Modal for Student */}
      <Modal
        isOpen={Boolean(submittingAssignment)}
        onClose={() => setSubmittingAssignment(null)}
        title={`Submit Assignment: ${submittingAssignment?.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleStudentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Upload Solution File (.zip, .pdf, .cpp)
            </label>
            <input
              type="text"
              required
              value={studentSubmitData.fileName}
              onChange={(e) => setStudentSubmitData({ ...studentSubmitData, fileName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Submission Notes / Remarks
            </label>
            <textarea
              rows={3}
              value={studentSubmitData.notes}
              onChange={(e) => setStudentSubmitData({ ...studentSubmitData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSubmittingAssignment(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md"
            >
              Confirm & Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
