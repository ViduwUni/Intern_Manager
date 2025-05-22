import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', form);
            const { user, token } = res.data;

            login(user, token);

            // Redirect based on role
            switch (user.role) {
                case 'admin':
                    navigate('/adminDashboard');
                    break;
                case 'manager':
                    navigate('/managerDashboard');
                    break;
                case 'supervisor':
                    navigate('/supervisorDashboard');
                    break;
                case 'intern':
                    navigate('/internDashboard');
                    break;
                default:
                    navigate('/');
            }

        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Something went wrong. Try again.');
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input placeholder='Email' onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type='password' placeholder='Password' onChange={e => setForm({ ...form, password: e.target.value })} />
                <button>Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <br />
            <button onClick={() => navigate('/register')}>Register</button>
        </div>
    );
}