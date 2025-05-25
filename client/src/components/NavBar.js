import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <>
      <nav>
        <ul>
          {user.role === 'admin' && (
            <>
              <li>
                <NavLink to="/adminDashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/interns">Interns</NavLink>
              </li>
              <li>
                <NavLink to="/userManager">User Management</NavLink>
              </li>
              <li>
                <NavLink to="/attendance">Attendance</NavLink>
              </li>
              <li>
                <NavLink to="/salaries">Salaries</NavLink>
              </li>
            </>
          )}

          {user.role === 'manager' && (
            <>
              <li>
                <NavLink to="/managerDashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/interns">Interns</NavLink>
              </li>
              <li>
                <NavLink to="/attendance">Attendance</NavLink>
              </li>
              <li>
                <NavLink to="/salaries">Salaries</NavLink>
              </li>
            </>
          )}

          {user.role === 'supervisor' && (
            <>
              <li>
                <NavLink to="/supervisorDashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/attendance">Attendance</NavLink>
              </li>
              <li>
                <NavLink to="/salaries">Salaries</NavLink>
              </li>
            </>
          )}

          {user.role === 'intern' && (
            <>
              <li>
                <NavLink to="/internDashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/internSalary">Salary</NavLink>
              </li>
              <li>
                <NavLink to="/internAttendance">Attendance</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <button onClick={logout}>Logout</button>
    </>
  );
}