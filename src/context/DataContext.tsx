import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  Student,
  Teacher,
  Course,
  AttendanceRecord,
  MarkRecord,
  Assignment,
  Submission,
  StudyMaterial,
  TimetableSlot,
  Announcement,
  SystemStats,
} from '../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_TIMETABLE,
  INITIAL_ANNOUNCEMENTS,
} from '../lib/mockData';

interface DataContextType {
  departments: Department[];
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  attendance: AttendanceRecord[];
  marks: MarkRecord[];
  assignments: Assignment[];
  submissions: Submission[];
  studyMaterials: StudyMaterial[];
  timetable: TimetableSlot[];
  announcements: Announcement[];
  stats: SystemStats;

  // Student CRUD
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Teacher CRUD
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Course CRUD
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Attendance Operations
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Marks Operations
  addMarkRecord: (record: Omit<MarkRecord, 'id' | 'percentage' | 'grade'>) => void;

  // Assignment Operations
  addAssignment: (assignment: Omit<Assignment, 'id' | 'submissionCount'>) => void;
  submitAssignment: (submission: Omit<Submission, 'id' | 'submissionDate' | 'status'>) => void;

  // Study Material Operations
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadDate'>) => void;

  // Announcement Operations
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sms_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('sms_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('sms_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('sms_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [marks, setMarks] = useState<MarkRecord[]>(() => {
    const saved = localStorage.getItem('sms_marks');
    return saved ? JSON.parse(saved) : INITIAL_MARKS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('sms_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('sms_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('sms_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  const [timetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('sms_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('sms_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('sms_teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('sms_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('sms_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('sms_marks', JSON.stringify(marks)); }, [marks]);
  useEffect(() => { localStorage.setItem('sms_assignments', JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem('sms_submissions', JSON.stringify(submissions)); }, [submissions]);
  useEffect(() => { localStorage.setItem('sms_materials', JSON.stringify(studyMaterials)); }, [studyMaterials]);
  useEffect(() => { localStorage.setItem('sms_announcements', JSON.stringify(announcements)); }, [announcements]);

  // Derived Statistics
  const stats: SystemStats = {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalCourses: courses.length,
    avgAttendance: Math.round(
      students.reduce((acc, curr) => acc + (curr.attendancePercentage || 90), 0) / (students.length || 1)
    ),
  };

  // Student Actions
  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `stu-${Date.now()}`;
    const dept = departments.find((d) => d.id === newStudent.departmentId);
    const createdStudent: Student = {
      ...newStudent,
      id,
      departmentName: dept?.name || 'General Science',
      attendancePercentage: 100,
      gpa: 3.8,
    };
    setStudents((prev) => [createdStudent, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const dept = updated.departmentId ? departments.find((d) => d.id === updated.departmentId) : undefined;
          return {
            ...s,
            ...updated,
            departmentName: dept ? dept.name : s.departmentName,
          };
        }
        return s;
      })
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Teacher Actions
  const addTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const id = `tch-${Date.now()}`;
    const dept = departments.find((d) => d.id === newTeacher.departmentId);
    const created: Teacher = {
      ...newTeacher,
      id,
      departmentName: dept?.name || 'General Engineering',
      avatarUrl: newTeacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    };
    setTeachers((prev) => [created, ...prev]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // Course Actions
  const addCourse = (newCourse: Omit<Course, 'id'>) => {
    const id = `crs-${Date.now()}`;
    const dept = departments.find((d) => d.id === newCourse.departmentId);
    const teacher = teachers.find((t) => t.id === newCourse.teacherId);
    const created: Course = {
      ...newCourse,
      id,
      departmentName: dept?.name || '',
      teacherName: teacher?.fullName || 'TBD',
    };
    setCourses((prev) => [created, ...prev]);
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Attendance Actions
  const markAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`,
    }));

    setAttendance((prev) => {
      // Replace duplicates for same student, course, and date
      const filtered = prev.filter(
        (existing) =>
          !newRecords.some(
            (nr) =>
              nr.studentId === existing.studentId &&
              nr.courseId === existing.courseId &&
              nr.date === existing.date
          )
      );
      return [...newRecords, ...filtered];
    });
  };

  // Marks Actions
  const addMarkRecord = (record: Omit<MarkRecord, 'id' | 'percentage' | 'grade'>) => {
    const percentage = (record.marksObtained / record.totalMarks) * 100;
    let grade: MarkRecord['grade'] = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const newMark: MarkRecord = {
      ...record,
      id: `mrk-${Date.now()}`,
      percentage,
      grade,
    };
    setMarks((prev) => [newMark, ...prev]);
  };

  // Assignment Actions
  const addAssignment = (assignment: Omit<Assignment, 'id' | 'submissionCount'>) => {
    const created: Assignment = {
      ...assignment,
      id: `asg-${Date.now()}`,
      submissionCount: 0,
    };
    setAssignments((prev) => [created, ...prev]);
  };

  const submitAssignment = (submission: Omit<Submission, 'id' | 'submissionDate' | 'status'>) => {
    const newSub: Submission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submissionDate: new Date().toLocaleString(),
      status: 'Submitted',
    };
    setSubmissions((prev) => [newSub, ...prev]);

    // Increment submission count
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === submission.assignmentId
          ? { ...a, submissionCount: (a.submissionCount || 0) + 1 }
          : a
      )
    );
  };

  // Study Material Actions
  const addStudyMaterial = (material: Omit<StudyMaterial, 'id' | 'uploadDate'>) => {
    const created: StudyMaterial = {
      ...material,
      id: `mat-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
    };
    setStudyMaterials((prev) => [created, ...prev]);
  };

  // Announcement Actions
  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    const created: Announcement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setAnnouncements((prev) => [created, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        departments,
        students,
        teachers,
        courses,
        attendance,
        marks,
        assignments,
        submissions,
        studyMaterials,
        timetable,
        announcements,
        stats,

        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addCourse,
        updateCourse,
        deleteCourse,
        markAttendance,
        addMarkRecord,
        addAssignment,
        submitAssignment,
        addStudyMaterial,
        addAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
