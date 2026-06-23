const express = require("express");
const router = express.Router();

const { getUserRentals, getAllUsers } = require("../controllers/usersController");

// GET svi korisnici
router.get("/", getAllUsers);

// GET rentals po user-u
router.get("/:id/rentals", getUserRentals);

module.exports = router;