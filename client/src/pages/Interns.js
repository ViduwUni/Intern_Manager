import { useEffect, useState } from 'react';
import axios from 'axios';
import InternForm from '../components/InternForm';
import InternList from '../components/InternList';
import InternDetails from '../components/InternDetails';

export default function Interns() {
    const [users, setUsers] = useState([]);
    const [interns, setInterns] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            const headers = { Authorization: `Bearer ${token}` };
            const userRes = await axios.get('http://localhost:5000/api/auth/users', { headers });
            const internRes = await axios.get('http://localhost:5000/api/interns', { headers });

            setUsers(userRes.data.filter(user => user.role === 'intern'));
            setInterns(internRes.data);
        };

        fetchData();
    }, [token]);

    const handleSelectIntern = (intern) => {
        setSelectedIntern(intern);
    };

    const handleCreated = (newIntern) => {
        setInterns(prev => [...prev, newIntern]);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manage Interns</h2>
            <InternForm users={users} token={token} onCreated={handleCreated} />
            <InternList interns={interns} onSelect={handleSelectIntern} />
            {selectedIntern && <InternDetails intern={selectedIntern} />}
        </div>
    );
}