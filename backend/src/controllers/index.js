const Imprest = require("../models/employee.Model.js");
const userModel = require("../models/user.Model.js");

const loginUser = async (req, res) => {
  try {
    const { role, department } = req.body;

    // Validate role and department
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Get data based on role and department
    const data = await getManagerData(role, department);

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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
    const {
      description,
      amount,
      department,
      urgencyLevel,
      refillAmount,
      vendorName,
    } = req.body;

    if (
      !description ||
      !amount ||
      !department ||
      !urgencyLevel ||
      !vendorName
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
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
    res
      .status(201)
      .json({ message: "Imprest Record Created", data: newImprest });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

async function getManagerData(role, department) {
  let query = { department };

  // Add role-based filtering
  switch (role) {
    case "Manager":
      return await Imprest.find(query);

    case "Admin":
      return await Imprest.find({});

    default:
      return [];
  }
}

const postManagerDepartment = async (req, res) => {};

module.exports = {
  getImprest,
  createImprest,
  getManagerData,
  postManagerDepartment,
  loginUser
};
