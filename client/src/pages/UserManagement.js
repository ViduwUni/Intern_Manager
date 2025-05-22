import { useState, useEffect } from 'react';
import API from '../api/api';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '' });
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await API.get('/api/auth/users');
        setUsers(res.data);
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: '', password: '' });
    };

    const handleDelete = async (id) => {
        await API.delete(`/api/auth/users/${id}`);
        fetchUsers();
    };

    const handleUpdate = async () => {
        const dataToSend = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
        };
        if (formData.password) {
            dataToSend.password = formData.password;
        }

        await API.put(`/api/auth/users/${editingUser}`, dataToSend);
        handleCancelEdit();
        fetchUsers();
    };

    const handleAddUser = async () => {
        await API.post('/api/auth/register', newUser);
        setNewUser({ name: '', email: '', password: '', role: '' });
        fetchUsers();
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h2>User Management</h2>

            {/* Filter */}
            <input
                type="text"
                placeholder="Filter by name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            {/* Add User Form */}
            <div>
                <h3>Add User</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="">Select Role</option>
                    <option value="intern">Intern</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={handleAddUser}>Create</button>
            </div>

            {/* User Table */}
            <div style={{ marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }} border={'1'}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                {editingUser === user._id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            >
                                                <option value="intern">Intern</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={handleUpdate}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>••••••</td>
                                        <td>
                                            <button onClick={() => handleEdit(user)}>Edit</button>
                                            <button onClick={() => handleDelete(user._id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPage;