import { Routes, Route } from 'react-router-dom';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InternDashboard from './pages/InternDashboard';
import Interns from './pages/Interns';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* Protected with role based auth and also check for token and isLogged in */}
      <Route
        path="/interns"
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
            <Interns />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
            <Dashboard />
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
    </Routes>
  );
}

export default App;