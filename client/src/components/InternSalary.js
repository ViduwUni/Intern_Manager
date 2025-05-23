import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from '../context/AuthContext';

export default function InternSalary() {
    const { user } = useContext(AuthContext);
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [internInfo, setInternInfo] = useState(null);

    useEffect(() => {
        if (!user) return;

        if (["admin", "manager", "supervisor"].includes(user.role)) {
            fetchAllSalaries();
        } else if (user.role === "intern" && user._id) {
            // Step 1: get internId by user._id
            fetchInternIdByUserId(user._id);
        } else {
            setError("You do not have permission to view this page.");
            setLoading(false);
        }
    }, [user]);

    const fetchAllSalaries = async () => {
        try {
            const res = await API.get("/api/salaries");
            setSalaries(res.data);
        } catch {
            setError("Failed to load salaries.");
        } finally {
            setLoading(false);
        }
    };

    const fetchInternIdByUserId = async (userId) => {
        try {
            const res = await API.get(`/api/interns/user/${userId}`);
            const intern = res.data;

            if (intern && intern._id) {
                setInternInfo(intern); // save full intern object
                fetchSalariesByIntern(intern._id);
            } else {
                setError("Intern record not found.");
                setLoading(false);
            }
        } catch {
            setError("Failed to load intern info.");
            setLoading(false);
        }
    };

    const fetchSalariesByIntern = async (internId) => {
        try {
            const res = await API.get(`/api/salaries/intern/salary/${internId}`);
            setSalaries(res.data);
        } catch {
            setError("Failed to load your salaries.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading salaries...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Salary Details</h2>
            {salaries.length === 0 ? (
                <p>No salary records found.</p>
            ) : (
                <table border="1" cellPadding="5">
                    <thead>
                        <tr>
                            <th>Intern</th>
                            <th>Amount</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.map((s) => (
                            <tr key={s._id}>
                                <td>{internInfo.fullName || "N/A"}</td>
                                <td>{s.amount}</td>
                                <td>{s.month}</td>
                                <td>{s.year}</td>
                                <td>{s.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}