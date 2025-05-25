import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  HelpCircleIcon,
  PlaneIcon,
  CircleDashedIcon,
} from 'lucide-react';

export default function InternAttendance() {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState({});
  const [internId, setInternId] = useState(null);
  const [internName, setInternName] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const fetchInternDetails = async () => {
      if (!user || !user._id) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await API.get(`/api/interns/me?userId=${user._id}`, { headers });
        const internData = res.data;
        setInternId(internData._id);
        setInternName(internData.fullName);
      } catch (err) {
        console.error('Failed to fetch intern details:', err);
      }
    };

    fetchInternDetails();
  }, [user, token]);

  const fetchAttendance = async () => {
    if (!internId) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await API.get(
        `/api/attendance/calendar/${internId}?month=${selectedMonth}&year=${selectedYear}`,
        { headers }
      );
      setAttendance(res.data || {});
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    fetchAttendance();
  };

  const renderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return <CheckCircleIcon className="text-green-500 inline-block w-5 h-5 mr-1" />;
      case 'absent':
        return <XCircleIcon className="text-red-500 inline-block w-5 h-5 mr-1" />;
      case 'short leave':
        return <ClockIcon className="text-yellow-500 inline-block w-5 h-5 mr-1" />;
      case 'half day':
        return <CircleDashedIcon className="text-yellow-500 inline-block w-5 h-5 mr-1" />;
      case 'leave':
        return <PlaneIcon className="text-yellow-500 inline-block w-5 h-5 mr-1" />;
      default:
        return <HelpCircleIcon className="text-gray-400 inline-block w-5 h-5 mr-1" />;
    }
  };

  useEffect(() => {
    if (internId) {
      fetchAttendance();
    }
  }, [internId, selectedMonth, selectedYear]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Attendance records for intern: {internName}
      </h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mr-2 font-medium">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded p-2"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Year:</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded p-2 w-24"
          />
        </div>

        <button
          onClick={fetchAttendance}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Filter
        </button>

        <button
          onClick={handleReset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reset to Current
        </button>
      </div>

      {loading ? (
        <div>Loading attendance...</div>
      ) : Object.keys(attendance).length === 0 ? (
        <p>No attendance records found for {selectedMonth}/{selectedYear}.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendance).map(([date, record], index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border p-2">{new Date(date).toLocaleDateString()}</td>
                <td className="border p-2 capitalize">
                  {renderStatusIcon(record.status)}
                  {record.status}
                </td>
                <td className="border p-2">
                  {record.remarks || `${record.checkIn} - ${record.checkOut}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}