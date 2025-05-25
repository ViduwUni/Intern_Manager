import { useEffect, useRef, useState } from "react";
import API from "../api/api";
import localHolidays from '../utils/LocalHolidays';
import { toast } from 'react-toastify';

export default function Attendance() {
    const [interns, setInterns] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [attendance, setAttendance] = useState({});
    const [form, setForm] = useState({
        date: '',
        status: '',
        checkIn: '',
        checkOut: ''
    });
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-indexed
    const [year, setYear] = useState(new Date().getFullYear());
    const [workingDays, setWorkingDays] = useState(0);
    const hasNotified = useRef(false);


    // Count weekdays (Mon-Fri) in month
    const countWeekdays = (year, month) => {
        let count = 0;
        const daysInMonth = new Date(year, month, 0).getDate(); // month 1-based
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // skip Sun(0), Sat(6)
        }
        return count;
    };

    // filter local holidays by year and month
    const fetchHolidays = async (year, month) => {
        return localHolidays.filter(dateStr => {
            const d = new Date(dateStr);
            return d.getFullYear() === year && (d.getMonth() + 1) === month;
        });
    };


    const calculateWorkingDays = async (year, month) => {
        const totalWeekdays = countWeekdays(year, month);
        const holidays = await fetchHolidays(year, month);

        let holidayWeekdaysCount = 0;
        holidays.forEach(hDate => {
            const d = new Date(hDate);
            const day = d.getDay();
            if (day !== 0 && day !== 6) holidayWeekdaysCount++;
        });

        return totalWeekdays - holidayWeekdaysCount;
    };

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const [internRes, todayRes] = await Promise.all([
                    API.get('/api/interns'),
                    API.get('/api/attendance/today')
                ]);
                const markedIds = todayRes.data;
                const internsWithToday = internRes.data.map(intern => ({
                    ...intern,
                    markedToday: markedIds.includes(intern._id)
                }));
                setInterns(internsWithToday);
            } catch (err) {
                console.error("Failed to fetch interns", err);
            }
        };
        fetchInterns();
    }, []);

    useEffect(() => {
        if (selectedIntern) {
            loadAttendance(selectedIntern._id);
            calculateWorkingDays(year, month).then(setWorkingDays);
        }
    }, [month, year, selectedIntern,]);

    const loadAttendance = async (internId) => {
        if (!internId) return;
        console.log(internId);
        try {
            const res = await API.get(`/api/attendance/calendar/${internId}?month=${month}&year=${year}`);
            const data = res.data;

            const presentStatuses = ['Present', 'Half Day', 'Short Leave'];

            const presentDays = Object.values(data).filter(a => presentStatuses.includes(a.status)).length;

            const totalDays = workingDays || countWeekdays(year, month);

            const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

            setAttendance({ ...data, _percentage: percentage });

            const todayStr = new Date().toISOString().split('T')[0];
            const isMarked = !!data[todayStr];

            setInterns(prev =>
                prev.map(i => i._id === internId ? { ...i, markedToday: isMarked } : i)
            );
        } catch (err) {
            console.error("Failed to load attendance", err);
        }
    };

    const markAttendance = async (e) => {
        e.preventDefault();
        if (!selectedIntern || !form.date || !form.status) return alert("Fill required fields");

        try {
            await API.post('/api/attendance', {
                internId: selectedIntern._id,
                ...form
            });
            alert("Attendance saved");
            await loadAttendance(selectedIntern._id);

            const todayRes = await API.get('/api/attendance/today');
            const markedIds = todayRes.data;
            setInterns(prev =>
                prev.map(i => ({
                    ...i,
                    markedToday: markedIds.includes(i._id)
                })));
        } catch (err) {
            alert("Failed to save");
            console.error(err);
        }
    };

    // Basic Notification
    useEffect(() => {
        const notifyIncomplete = () => {
            const marked = interns.filter(i => i.markedToday).length;
            const total = interns.length;
            if (total > 0 && marked < total) {
                toast.info(`${marked}/${total} interns have marked attendance today.`);
            }
        };

        if (interns.length && !hasNotified.current) {
            notifyIncomplete();
            hasNotified.current = true;
        }
    }, [interns]);

    return (
        <div>
            <h2>Intern Attendance Tracker</h2>

            <h3>Intern List</h3>
            <table border="1" cellPadding="5" style={{ marginBottom: '20px', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Intern ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Joined</th>
                        <th>Attendance Today</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {interns.map((i) => (
                        <tr key={i._id}>
                            <td>{i.internId}</td>
                            <td>{i.fullName.split(' ').slice(-2).join(' ')}</td>
                            <td>{i.department}</td>
                            <td>{new Date(i.joinedDate).toLocaleDateString()}</td>
                            <td>{i.markedToday ? '✔️' : '❌'}</td>
                            <td>
                                <button onClick={() => {
                                    setSelectedIntern(i);
                                }}>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedIntern && (
                <>
                    <h3>Selected: {selectedIntern.fullName}</h3>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Month: </label>
                        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <label style={{ marginLeft: '10px' }}>Year: </label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            style={{ width: '80px' }}
                        />
                        <button onClick={() => loadAttendance(selectedIntern._id)} style={{ marginLeft: '10px' }}>
                            Filter
                        </button>
                    </div>

                    <h4>Mark Attendance</h4>
                    <form onSubmit={markAttendance}>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="">Select Status</option>
                            <option value="Present">Present</option>
                            <option value="Leave">Leave</option>
                            <option value="Half Day">Half Day</option>
                            <option value="Short Leave">Short Leave</option>
                            <option value="Absent">Absent</option>
                        </select>
                        <input
                            type="time"
                            value={form.checkIn}
                            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                        />
                        <input
                            type="time"
                            value={form.checkOut}
                            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                        />
                        <button type="submit">Submit</button>
                    </form>

                    <h4>Attendance Calendar View</h4>
                    <p><strong>Attendance percentage:</strong> {attendance._percentage ?? 0}%</p>
                    <table border="1" cellPadding="5" style={{ marginTop: "10px", width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(attendance)
                                .filter(([date]) => date !== '_percentage')
                                .map(([date, info]) => (
                                    <tr key={date}>
                                        <td>{date}</td>
                                        <td>{info.status}</td>
                                        <td>{info.checkIn || "-"}</td>
                                        <td>{info.checkOut || "-"}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}