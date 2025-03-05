const express = require("express");
const { getImprest, createImprest, getManagerData, postManagerDepartment, loginUser, getImprestBasedOnRole, createImprestBasedOnRoles } = require("../controllers/index.js");
const { login } = require("../controllers/auth.controller.js");
const Imprest = require("../models/employee.Model.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

// login route
router.post("/login", login);

// employee data apis
router.get("/getAllImprest", getImprest);
router.post("/createImprest", createImprestBasedOnRoles);
router.get("/getManagerData", getManagerData);

// Get imprest data based on role and department
router.get('/get-imprest-based-on-role', authMiddleware ,getImprestBasedOnRole );


module.exports = router;
