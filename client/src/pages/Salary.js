import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from '../context/AuthContext';

export default function SalaryPage() {
    const [salaries, setSalaries] = useState([]);
    const [interns, setInterns] = useState([]);
    const [form, setForm] = useState({
        internId: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchSalaries();
        fetchInterns();
    }, []);

    const fetchSalaries = async () => {
        const res = await API.get("/api/salaries");
        setSalaries(res.data);
    };

    const fetchInterns = async () => {
        const res = await API.get("/api/interns");
        setInterns(res.data);
    };

    const handleAddSalary = async (e) => {
        e.preventDefault();
        try {
            await API.post("/api/salaries", form);
            setForm({ internId: "", amount: "", month: "", year: "" });
            fetchSalaries();
        } catch (err) {
            alert("Failed to add salary");
        }
    };

    const handleStatusChange = async (id, status) => {
        await API.put(`/api/salaries/status/${id}`, { status });
        fetchSalaries();
    };

    const handleFilter = async (e) => {
        const internId = e.target.value;
        if (internId === "") {
            fetchSalaries(); // Reset to all
        } else {
            const res = await API.get(`/api/salaries/intern/salary/${internId}`);
            setSalaries(res.data);
        }
    };

    const getInternName = (internId) => {
        if (typeof internId === "object") return internId.fullName;
        return interns.find(i => i._id === internId)?.fullName || "N/A";
    };

    const getUnpaidInterns = () => {
        return interns.filter(intern => {
            const alreadyPaid = salaries.some(salary =>
                salary.internId === intern._id &&
                salary.month === Number(form.month) &&
                salary.year === Number(form.year)
            );
            return !alreadyPaid;
        });
    };

    console.log(user.role);
    return (
        <div>
            <h2>Salary Management</h2>

            <h3>Add Salary</h3>
            <form onSubmit={handleAddSalary}>
                <select
                    value={form.internId}
                    onChange={(e) => setForm({ ...form, internId: e.target.value })}
                >
                    <option value="">Select Intern</option>
                    {getUnpaidInterns().map((i) => (
                        <option key={i._id} value={i._id}>
                            {i.fullName}
                        </option>
                    ))}
                </select>
                {getUnpaidInterns().length === 0 && (
                    <p>No unpaid interns for {form.month}/{form.year}</p>
                )}
                <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Month"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
                <button type="submit">Add Salary</button>
            </form>

            <h3>All Salaries</h3>
            <h4>Filter by Intern</h4>
            <select onChange={handleFilter}>
                <option value="">All Interns</option>
                {interns.map(i => (
                    <option key={i._id} value={i._id}>
                        {i.fullName}
                    </option>
                ))}
            </select>

            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>Intern</th>
                        <th>Amount</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Status</th>
                        <th>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {salaries.map((s) => (
                        <tr key={s._id}>
                            <td>{getInternName(s.internId)}</td>
                            <td>{s.amount}</td>
                            <td>{s.month}</td>
                            <td>{s.year}</td>
                            <td>{s.status}</td>
                            <td>
                                {user && user.role && s.status === "Pending" && ["manager", "admin"].includes(user.role) && (
                                    <button onClick={() => handleStatusChange(s._id, "Approved")}>Approve</button>
                                )}
                                {user && user.role && s.status === "Approved" && ["manager", "admin", "supervisor"].includes(user.role) && (
                                    <button onClick={() => handleStatusChange(s._id, "Paid")}>Mark Paid</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}