const express = require("express");
const router = express.Router();

const {
    getAllGames,
    createGame,
    updateGame,
    deleteGame,
    getAvailableGames,
    filterGames,
    getTopGames
} = require("../controllers/gamesController");

// GET za sve igrice
router.get("/", getAllGames);

// GET za dostupne igrice
router.get("/available", getAvailableGames);

// GET za filtrirane igrice
router.get("/filter", filterGames);

// GET za top 3 igrice
router.get("/top", getTopGames);

// POST za novu igricu
router.post("/", createGame);

// PUT za izmenu igrice
router.put("/:id", updateGame);

// DELETE za igricu
router.delete("/:id", deleteGame);

module.exports = router;