const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    internId: { type: String, required: true, unique: true },
    joinedDate: { type: Date, required: true },
    duration: { type: String, required: true },
    department: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'completed', 'left-early'],
        default: 'active',
    },
    supervisor: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Intern', internSchema);