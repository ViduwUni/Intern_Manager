import { Routes, Route } from 'react-router-dom';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
// Dashboards
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import InternDashboard from './pages/InternDashboard';
// Other
import Interns from './pages/Interns';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route
        path="/adminDashboard"
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminDashboard />
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
    </Routes>
  );
}

export default App;