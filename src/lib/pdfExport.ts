import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, AttendanceRecord, MarkRecord, Course } from '../types';

export const exportAttendancePDF = (
  attendanceList: AttendanceRecord[],
  studentsList: Student[],
  coursesList: Course[],
  filterCourseName?: string
) => {
  const doc = new jsPDF();

  // Header Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text('SMART STUDENT MANAGEMENT SYSTEM', 14, 20);

  doc.setFontSize(13);
  doc.setTextColor(71, 85, 105);
  doc.text(`Official Attendance Report ${filterCourseName ? `- ${filterCourseName}` : ''}`, 14, 28);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Records: ${attendanceList.length}`, 14, 34);

  // Table columns & rows
  const tableColumn = ['Date', 'Student ID', 'Student Name', 'Course', 'Status', 'Marked By'];
  const tableRows = attendanceList.map((record) => {
    const student = studentsList.find((s) => s.id === record.studentId);
    return [
      record.date,
      student ? student.studentId : 'N/A',
      record.studentName || student?.fullName || 'N/A',
      record.courseName || 'N/A',
      record.status,
      record.markedBy || 'Faculty',
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  doc.save(`Attendance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportMarksPDF = (
  marksList: MarkRecord[],
  studentsList: Student[],
  examFilter?: string
) => {
  const doc = new jsPDF();

  // Header Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text('SMART STUDENT MANAGEMENT SYSTEM', 14, 20);

  doc.setFontSize(13);
  doc.setTextColor(71, 85, 105);
  doc.text(`Academic Examination Marks Report ${examFilter ? `- ${examFilter}` : ''}`, 14, 28);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Records: ${marksList.length}`, 14, 34);

  const tableColumn = ['Student ID', 'Student Name', 'Course', 'Exam', 'Marks', 'Percentage', 'Grade'];
  const tableRows = marksList.map((m) => {
    const student = studentsList.find((s) => s.id === m.studentId);
    return [
      student ? student.studentId : 'N/A',
      m.studentName || student?.fullName || 'N/A',
      m.courseName || 'N/A',
      m.examName,
      `${m.marksObtained} / ${m.totalMarks}`,
      `${m.percentage.toFixed(1)}%`,
      m.grade,
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  doc.save(`Academic_Marks_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Push header row
  csvRows.push(headers.join(','));

  // Push data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
