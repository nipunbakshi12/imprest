const express = require("express");
const { getImprest, createImprest } = require("../controllers/index.js");

const router = express.Router();

router.get("/getAllImprest", getImprest);
router.post("/createImprest", createImprest);

module.exports = router;
