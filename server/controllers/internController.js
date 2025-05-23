const Intern = require('../models/Intern');
const User = require('../models/User');

// CREATE
exports.createIntern = async (req, res) => {
    try {
        const { user, fullName, address, mobile, email, internId, joinedDate, duration, department, status, supervisor } = req.body;

        const linkedUser = await User.findById(user);
        if (!linkedUser || linkedUser.role !== 'intern') {
            return res.status(400).json({ error: 'User must exist and be an intern' });
        }

        const newIntern = await Intern.create({
            user,
            fullName,
            address,
            mobile,
            email,
            internId,
            joinedDate,
            duration,
            department,
            status,
            supervisor,
        });

        res.status(201).json(newIntern);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating intern' });
    }
};

// FETCH ALL
exports.getInterns = async (req, res) => {
    try {
        const interns = await Intern.find().populate('user', 'name email');
        res.json(interns);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch interns' });
    }
};

// FETCH ME
// GET /api/interns/me?userId=123
exports.getMyInternProfile = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const intern = await Intern.findOne({ user: userId }).populate('user', 'name email');
        if (!intern) return res.status(404).json({ error: 'Intern profile not found' });

        res.json(intern);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch intern profile' });
    }
};

// EDIT/UPDATE
exports.updateIntern = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Intern.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Intern not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update intern' });
    }
};


exports.getInternByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const intern = await Intern.findOne({ user: userId }); // Use correct field name
        if (!intern) {
            return res.status(404).json({ message: "Intern not found" });
        }
        res.json(intern);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};