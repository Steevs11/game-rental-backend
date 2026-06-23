const express = require("express");
const router = express.Router();

const {
    createRental,
    returnRental,
    getAllRentals,
    getActiveRentals,
    getGameHistory,
} = require("../controllers/rentalsController");

router.get("/", getAllRentals);
router.get("/active", getActiveRentals);
router.post("/", createRental);
router.get("/history/:id_igrice", getGameHistory);
router.put("/:id/return", returnRental);

module.exports = router;