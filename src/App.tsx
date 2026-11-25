import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { StudentProfile } from './pages/StudentProfile';
import { Teachers } from './pages/Teachers';
import { Courses } from './pages/Courses';
import { Attendance } from './pages/Attendance';
import { Marks } from './pages/Marks';
import { Assignments } from './pages/Assignments';
import { StudyMaterials } from './pages/StudyMaterials';
import { Timetable } from './pages/Timetable';
import { Announcements } from './pages/Announcements';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const MainLayout: React.FC = () => {
  const { isAuthenticated, role, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  if (!isAuthenticated) {
    return <Login onSuccess={() => setCurrentPage('dashboard')} />;
  }

  const handleSelectStudentProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentPage('profile');
  };

  const renderPage = () => {
    // Role-based protection check
    if (role === 'Student' && (currentPage === 'teachers' || currentPage === 'reports')) {
      return <Dashboard onNavigate={(page) => setCurrentPage(page)} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={(page) => setCurrentPage(page)} />;
      case 'students':
        return <Students onSelectStudentProfile={handleSelectStudentProfile} />;
      case 'profile':
        return (
          <StudentProfile
            studentId={selectedStudentId || user?.studentId || 'stu-1'}
            onBack={() => setCurrentPage(role === 'Student' ? 'dashboard' : 'students')}
          />
        );
      case 'teachers':
        return <Teachers />;
      case 'courses':
        return <Courses />;
      case 'attendance':
        return <Attendance />;
      case 'marks':
        return <Marks />;
      case 'assignments':
        return <Assignments />;
      case 'materials':
        return <StudyMaterials />;
      case 'timetable':
        return <Timetable />;
      case 'announcements':
        return <Announcements />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={(page) => setCurrentPage(page)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(pageId) => {
          setCurrentPage(pageId);
          if (pageId !== 'profile') setSelectedStudentId(null);
        }}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainLayout />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
