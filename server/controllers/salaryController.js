const Salary = require('../models/Salary');

exports.createSalary = async (req, res) => {
    try {
        const salary = new Salary(req.body);
        await salary.save();
        res.status(201).json(salary);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSalariesByIntern = async (req, res) => {
    try {
        const salaries = await Salary.find({ internId: req.params.internId });
        res.json(salaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSalaryStatus = async (req, res) => {
    try {
        const salary = await Salary.findByIdAndUpdate(
            req.params.salaryId,
            { status: req.body.status },
            { new: true }
        );
        res.json(salary);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find().populate('internId', 'fullName internId');
        res.json(salaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};