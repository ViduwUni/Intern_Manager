import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleProtectedRoute({ children, allowedRoles }) {
    const { token, user } = useContext(AuthContext);

    if (!token) return <Navigate to="/" replace />;

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}