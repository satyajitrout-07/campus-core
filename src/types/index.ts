// Core Types for Smart Student Management System

export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  totalStudents?: number;
  totalTeachers?: number;
}

export interface Student {
  id: string;
  studentId: string; // e.g. STU-2026-001
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  departmentId: string;
  departmentName?: string;
  semester: number; // 1-8
  avatarUrl: string;
  address: string;
  attendancePercentage?: number;
  gpa?: number;
}

export interface Teacher {
  id: string;
  employeeId: string; // e.g. TCH-101
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName?: string;
  specialization: string;
  joiningDate: string;
  assignedSubjectIds?: string[];
  avatarUrl?: string;
}

export interface Course {
  id: string;
  code: string; // e.g. CS101
  name: string;
  departmentId: string;
  departmentName?: string;
  semester: number;
  credits: number;
  teacherId: string;
  teacherName?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late';
  markedBy?: string;
}

export interface MarkRecord {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  examName: string; // e.g. Midterm, Final, Quiz 1
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  remarks?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName?: string;
  teacherId: string;
  dueDate: string;
  attachmentUrl?: string;
  attachmentName?: string;
  totalPoints: number;
  submissionCount?: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  submissionDate: string;
  fileUrl?: string;
  fileName?: string;
  notes?: string;
  gradeObtained?: number;
  status: 'Submitted' | 'Graded' | 'Late';
}

export interface StudyMaterial {
  id: string;
  title: string;
  courseId: string;
  courseName?: string;
  semester: number;
  uploadedBy: string;
  uploaderName?: string;
  fileUrl: string;
  fileName: string;
  fileType: string; // e.g., PDF, DOCX, PPTX
  fileSize: string; // e.g., 2.4 MB
  uploadDate: string;
}

export interface TimetableSlot {
  id: string;
  courseId: string;
  courseName?: string;
  courseCode?: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g., "09:00 AM"
  endTime: string;   // e.g., "10:30 AM"
  roomNumber: string;
  teacherName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  publishedBy: string;
  targetRole: 'All' | 'Teacher' | 'Student';
  createdAt: string;
}

export interface SystemStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  avgAttendance: number;
}
