export default function InternDetails({ intern }) {
    return (
        <div className="p-4 border rounded shadow">
            <h3 className="text-lg font-bold mb-2">Intern Details</h3>
            <p><strong>ID:</strong> {intern.internId}</p>
            <p><strong>Name:</strong> {intern.fullName}</p>
            <p><strong>Email:</strong> {intern.email}</p>
            <p><strong>Mobile:</strong> {intern.mobile}</p>
            <p><strong>Address:</strong> {intern.address}</p>
            <p><strong>Joined:</strong> {new Date(intern.joinedDate).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> {intern.duration}</p>
            <p><strong>Department:</strong> {intern.department}</p>
            <p><strong>Status:</strong> {intern.status}</p>
            <p><strong>Supervisor:</strong> {intern.supervisor}</p>
            <p><strong>Created At:</strong> {new Date(intern.createdAt).toLocaleString()}</p>
        </div>
    );
}