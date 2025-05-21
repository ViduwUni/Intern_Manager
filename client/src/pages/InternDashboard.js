import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';

export default function InternDashboard() {
    const { user } = useContext(AuthContext);
    const [intern, setIntern] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchInternData = async () => {
            if (!user || !user._id) return;

            try {
                const headers = { Authorization: `Bearer ${token}` };
                const res = await API.get(`/api/interns/me?userId=${user._id}`, { headers });
                setIntern(res.data);
            } catch (err) {
                console.error('Failed to fetch intern data', err);
            }
        };

        fetchInternData();
    }, [token, user]);

    if (!intern) return <div className="p-4">Loading dashboard...</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Welcome, {intern.fullName}</h1>

            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <h2 className="text-lg font-semibold mb-2">Personal Info</h2>
                <p>Email: {intern.email}</p>
                <p>Mobile: {intern.mobile}</p>
                <p>Address: {intern.address}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <h2 className="text-lg font-semibold mb-2">Internship Details</h2>
                <p>Intern ID: {intern.internId}</p>
                <p>Joined Date: {new Date(intern.joinedDate).toLocaleDateString()}</p>
                <p>Duration: {intern.duration} months</p>
                <p>Department: {intern.department}</p>
                <p>Supervisor: {intern.supervisor}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Status</h2>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(intern.status)}`}>
                    {intern.status}
                </span>
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'completed':
            return 'bg-blue-100 text-blue-800';
        case 'left-early':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}