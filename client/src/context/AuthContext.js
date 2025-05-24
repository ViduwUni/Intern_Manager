import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [error, setError] = useState(null);

    const login = async (userData, token) => {
        console.log('Received userData from backend:', userData);

        if (userData.role === 'intern') {
            try {
                const response = await API.get(`/api/interns/me?userId=${userData._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const internProfile = response.data;

                if (!internProfile) {
                    console.log('No intern profile data returned from backend');
                    toast.warning('Your intern profile hasn’t been created yet. Please contact the admin.');
                    // Reset session
                    setUser(null);
                    setToken('');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setError(null);
                    navigate('/');
                    return;
                } else {
                    console.log('Intern profile found:', internProfile);
                    // Proceed with login
                    setUser(userData);
                    setToken(token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', token);
                    setError(null);
                    navigate('/internDashboard');
                }
            } catch (err) {
                console.error('Failed to verify intern profile:', err);
                toast.warning('Your intern profile hasn’t been created yet. Please contact the admin or manager.');
                setUser(null);
                setToken('');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setError(null);
                navigate('/');
            }
        } else {
            // For other roles, just login normally
            setUser(userData);
            setToken(token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            setError(null);
            navigate('/dashboard');
        }
    };


    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};