const Imprest = require("../models/employee.Model.js");

// @desc    Get all Imprest records
// @route   GET /api/imprest
const getImprest = async (req, res) => {
    try {
        const imprestRecords = await Imprest.find();
        res.status(200).json(imprestRecords);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc    Create new Imprest record
// @route   POST /api/imprest
const createImprest = async (req, res) => {
    try {
        const { description, amount, department, urgencyLevel, refillAmount,vendorName } = req.body;

        if (!description || !amount || !department || !urgencyLevel || !vendorName ) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const newImprest = new Imprest({
            description,
            amount,
            department,
            urgencyLevel,
            refillAmount,
            vendorName,
        });

        await newImprest.save();
        res.status(201).json({ message: "Imprest Record Created", data: newImprest });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { getImprest, createImprest };
