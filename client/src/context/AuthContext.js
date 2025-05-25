import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // <-- Add loading state

    const login = async (userData, token) => {
        setLoading(true);
        setTimeout(async () => {
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
                        setUser(null);
                        setToken('');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        setError(null);
                        navigate('/');
                    } else {
                        console.log('Intern profile found:', internProfile);
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
                setUser(userData);
                setToken(token);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', token);
                setError(null);

                switch (userData.role) {
                    case 'admin':
                        navigate('/adminDashboard');
                        break;
                    case 'manager':
                        navigate('/managerDashboard');
                        break;
                    case 'supervisor':
                        navigate('/supervisorDashboard');
                        break;
                    default:
                        navigate('/');
                }
            }

            setLoading(false);
        }, 2300);
    };

    const logout = () => {
        setLoading(true);
        setTimeout(() => {
            setUser(null);
            setToken('');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/');
            setLoading(false);
        }, 2300);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, error, loading }}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    <Loader />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};