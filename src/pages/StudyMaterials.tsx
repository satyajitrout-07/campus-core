import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StudyMaterial } from '../types';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { FolderDown, Plus, Download, FileText, Filter, Search, BookOpen } from 'lucide-react';

export const StudyMaterials: React.FC = () => {
  const { studyMaterials, courses, teachers, addStudyMaterial } = useData();
  const { user, role } = useAuth();

  const [selectedSemester, setSelectedSemester] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    courseId: courses[0]?.id || 'crs-101',
    semester: 5,
    fileName: 'Lecture_Notes_Unit1.pdf',
    fileType: 'PDF',
    fileSize: '3.4 MB',
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === formData.courseId);

    addStudyMaterial({
      title: formData.title,
      courseId: formData.courseId,
      courseName: course?.name || 'Course',
      semester: formData.semester,
      uploadedBy: user?.id || 'tch-1',
      uploaderName: user?.fullName || 'Faculty Member',
      fileUrl: '#',
      fileName: formData.fileName,
      fileType: formData.fileType,
      fileSize: formData.fileSize,
    });

    setToastMessage(`Study material "${formData.title}" uploaded!`);
    setIsUploadModalOpen(false);
  };

  const handleDownload = (material: StudyMaterial) => {
    setToastMessage(`Downloading "${material.fileName}" (${material.fileSize})...`);
  };

  const filteredMaterials = useMemo(() => {
    return studyMaterials.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSem = selectedSemester === 'All' || m.semester === Number(selectedSemester);
      return matchesSearch && matchesSem;
    });
  }, [studyMaterials, searchTerm, selectedSemester]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <Toast message={toastMessage || ''} isOpen={Boolean(toastMessage)} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Study Materials Repository</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access subject lecture notes, reference PDFs, syllabus slides, and downloadable academic resources
          </p>
        </div>

        {(role === 'Admin' || role === 'Teacher') && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search material title or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter Semester:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="All">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => (
          <div key={mat.id} className="glass-card p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {mat.fileType}
                </span>
                <Badge variant="neutral">Sem {mat.semester}</Badge>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{mat.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{mat.courseName}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                <span>{mat.fileSize}</span> • <span>{mat.uploadDate}</span>
              </div>

              <button
                onClick={() => handleDownload(mat)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Material Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Study Material"
        maxWidth="md"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Material Document Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              placeholder="e.g. Advanced Graph Algorithms Lecture Notes"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course
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
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                File Name
              </label>
              <input
                type="text"
                required
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                File Extension / Type
              </label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="PPTX">PPTX</option>
                <option value="ZIP">ZIP</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
            >
              Upload Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
