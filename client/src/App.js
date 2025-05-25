import { Routes, Route } from 'react-router-dom';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
// Dashboards
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import InternDashboard from './pages/InternDashboard';
// Other
import Interns from './pages/Interns';
import Attendance from './pages/Attendance';
import Salary from './pages/Salary';
import InternSalary from './components/InternSalary';
import InternAttendance from './pages/InternAttendance';
import NavBar from './components/NavBar';

// Navbar for authenticated pages
function AuthLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin && Manager && Supervisor */}
        <Route
          path="/adminDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AuthLayout>
                <AdminDashboard />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/managerDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['manager']}>
              <AuthLayout>
                <ManagerDashboard />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/interns"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
              <AuthLayout>
                <Interns />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/userManager"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
              <AuthLayout>
                <UserManagement />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager', 'supervisor']}>
              <AuthLayout>
                <Attendance />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/salaries"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager', 'supervisor']}>
              <AuthLayout>
                <Salary />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/supervisorDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['supervisor']}>
              <AuthLayout>
                <SupervisorDashboard />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />


        {/* Intern */}
        <Route
          path="/internDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['intern']}>
              <AuthLayout>
                <InternDashboard />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/internSalary"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager', 'supervisor', 'intern']}>
              <AuthLayout>
                <InternSalary />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/internAttendance"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager', 'supervisor', 'intern']}>
              <AuthLayout>
                <InternAttendance />
              </AuthLayout>
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;