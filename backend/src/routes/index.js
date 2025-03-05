const express = require("express");
const { getImprest, createImprest, getManagerData, postManagerDepartment, loginUser } = require("../controllers/index.js");
const { login } = require("../controllers/auth.controller.js");

const router = express.Router();

// login route
router.post("/login", login);


router.get("/getAllImprest", getImprest);
router.post("/createImprest", createImprest);
router.get("/getManagerData", getManagerData);
router.post("/postManagerDepartment", postManagerDepartment);

module.exports = router;
