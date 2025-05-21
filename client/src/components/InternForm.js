import { useState } from 'react';
import API from '../api/api';

export default function InternForm({ users, token, onCreated }) {
    const [form, setForm] = useState({
        user: '',
        fullName: '',
        address: '',
        mobile: '',
        email: '',
        internId: '',
        joinedDate: '',
        duration: '',
        department: '',
        status: 'active',
        supervisor: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await API.post('/api/interns', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onCreated(res.data);
            setForm({ ...form, internId: '', fullName: '', email: '', mobile: '', address: '', joinedDate: '', duration: '', department: '', supervisor: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create intern');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow">
            <h3 className="font-semibold mb-2">Create Intern Profile</h3>

            <select name="user" value={form.user} onChange={handleChange} required className="mb-2 block">
                <option value="">Select Intern User</option>
                {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
            </select>

            <input name="internId" placeholder="Intern ID" value={form.internId} onChange={handleChange} required className="mb-2 block" />
            <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="mb-2 block" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="mb-2 block" />
            <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} required className="mb-2 block" />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="mb-2 block" />
            <input type="date" name="joinedDate" value={form.joinedDate} onChange={handleChange} required className="mb-2 block" />
            <input name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} required className="mb-2 block" />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required className="mb-2 block" />
            <input name="supervisor" placeholder="Supervisor" value={form.supervisor} onChange={handleChange} required className="mb-2 block" />

            <select name="status" value={form.status} onChange={handleChange} required className="mb-2 block">
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="left-early">Left Early</option>
            </select>

            <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded">Create</button>
        </form>
    );
}