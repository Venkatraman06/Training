import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import TrainingCRM from './pages/TrainingCRM';
import SalesCRM from './pages/SalesCRM';
import TrainingPlanning from './pages/TrainingPlanning';
import InstructorManagement from './pages/InstructorManagement';
import StudentManagement from './pages/StudentManagement';
import AssessmentSystem from './pages/AssessmentSystem';

import FinanceManagement from './pages/FinanceManagement';
import CertificateManagement from './pages/CertificateManagement';
import ProjectDocuments from './pages/ProjectDocuments';
import Reports from './pages/Reports';
import MarketingManagement from './pages/MarketingManagement';
import FeedbackSurvey from './pages/FeedbackSurvey';
import AIAssistant from './pages/AIAssistant';
import AutomationCenter from './pages/AutomationCenter';
import TaskManagement from './pages/TaskManagement';
import NotificationCenter from './pages/NotificationCenter';
import AdminSettings from './pages/AdminSettings';

import CollegeManagement from './pages/CollegeManagement';
import CertificationStudents from './pages/CertificationStudents';
import ClientManagement from './pages/ClientManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import CalendarManagement from './pages/CalendarManagement';
import MeetingsManagement from './pages/MeetingsManagement';

import ModulePlaceholder from './pages/ModulePlaceholder';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

import { ModalProvider } from './context/ModalContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <ModalProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Dashboard Layout Direct Access */}
                <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  
                  {/* General Dashboard */}
                  <Route path="dashboard/*" element={<Dashboard />} />
                  
                  {/* CRM & Sales */}
                  <Route path="crm/*" element={<TrainingCRM />} />
                  <Route path="sales/*" element={<SalesCRM />} />
                  <Route path="clients/*" element={<ClientManagement />} />
                  
                  {/* Training Operations */}
                  <Route path="planning/*" element={<TrainingPlanning />} />
                  <Route path="instructors/*" element={<InstructorManagement />} />
                  <Route path="students/*" element={<StudentManagement />} />
                  <Route path="assessments/*" element={<AssessmentSystem />} />
                  <Route path="colleges/*" element={<CollegeManagement />} />
                  <Route path="certification-students/*" element={<CertificationStudents />} />
                  <Route path="employees/*" element={<EmployeeManagement />} />
                  <Route path="calendar/*" element={<CalendarManagement />} />
                  <Route path="meetings/*" element={<MeetingsManagement />} />
                  
                  {/* Finance & Reports */}
                  <Route path="finance/*" element={<FinanceManagement />} />
                  <Route path="reports/*" element={<Reports />} />
                  
                  {/* Operational details */}
                  <Route path="certificates/*" element={<CertificateManagement />} />
                  <Route path="documents/*" element={<ProjectDocuments />} />
                  <Route path="marketing/*" element={<MarketingManagement />} />
                  <Route path="feedback/*" element={<FeedbackSurvey />} />
                  <Route path="ai-assistant/*" element={<AIAssistant />} />
                  <Route path="automations/*" element={<AutomationCenter />} />

                  {/* Core tasks & settings */}
                  <Route path="tasks/*" element={<TaskManagement />} />
                  <Route path="notifications/*" element={<NotificationCenter />} />
                  <Route path="settings/*" element={<AdminSettings />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<ModulePlaceholder />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
