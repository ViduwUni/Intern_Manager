import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'intern' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://localhost:5000/api/auth/register', form);
            alert('Registered! Now login.');
            navigate('/');
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Something went wrong. Try again.');
            }
        }
    };

    useEffect(() => {
        if (error) alert(error);
    }, [error]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input placeholder='Name' onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder='Email' onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type='password' placeholder='Password' onChange={e => setForm({ ...form, password: e.target.value })} />
                <select onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value='intern'>Intern</option>
                    <option value='supervisor'>Supervisor</option>
                    <option value='manager'>Manager</option>
                    <option value='admin'>Admin</option>
                </select>
                <button>Register</button>
            </form>
            <br />
            <button onClick={() => navigate('/')}>Login</button>
        </div>
    );
}