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

function App() {
  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route
          path="/adminDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/managerDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/supervisorDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['supervisor']}>
              <SupervisorDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/internDashboard"
          element={
            <RoleProtectedRoute allowedRoles={['intern']}>
              <InternDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/interns"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
              <Interns />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/userManager"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager', 'supervisor']}>
              <Attendance />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/salaries"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager', 'supervisor']}>
              <Salary />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/internSalary"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'manager', 'supervisor', 'intern']}>
              <InternSalary />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;