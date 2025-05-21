export default function InternList({ interns, onSelect }) {
    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2">Intern List</h3>
            <ul className="space-y-1">
                {interns.map(intern => (
                    <li
                        key={intern._id}
                        className="cursor-pointer hover:underline text-blue-600"
                        onClick={() => onSelect(intern)}
                    >
                        {intern.fullName} ({intern.internId})
                    </li>
                ))}
            </ul>
        </div>
    );
}