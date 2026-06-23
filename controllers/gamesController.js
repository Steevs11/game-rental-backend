const { readJSON, writeJSON } = require("../utils/fileHelper");

// GET za sve igrice
const getAllGames = (req, res) => {
    const games = readJSON("games.json");
    const rentals = readJSON("rentals.json");

    const gamesWithStatus = games.map(game => {
        const isRented = rentals.some(r =>
            r.id_igrice === game.id_igrice && r.stvarni_datum_vracanja === null
        );

        return {
            ...game,
            status: isRented ? "IZNAJMLJENA" : "DOSTUPNA"
        };

    });

    res.json(gamesWithStatus);
};

// POST za novu igricu
const createGame = (req, res) => {
    const games = readJSON("games.json");

    const newGame = {
        id_igrice: games.length ? games[games.length - 1].id_igrice + 1 : 1, ...req.body,
    };

    games.push(newGame);
    writeJSON("games.json", games);

    res.status(201).json(newGame);

};

// PUT update za igricu
const updateGame = (req, res) => {
    const games = readJSON("games.json");
    const id = parseInt(req.params.id);

    const index = games.findIndex(g => g.id_igrice === id);

    if (index === -1) {
        return res.status(404).json({ message: "Igrica nije pronadjena" });
    }

    games[index] = { ...games[index], ...req.body };

    writeJSON("games.json", games);

    res.json(games[index]);

};

const deleteGame = (req, res) => {
    const games = readJSON("games.json");
    const id = parseInt(req.params.id);

    const filtered = games.filter(g => g.id_igrice !== id);

    if (games.length === filtered.length) {
        return res.status(404).json({ message: "Igrica nije pronadjena" });
    }

    writeJSON("games.json", filtered);

    res.json({ message: "Igrica obrisana" });

};

const getAvailableGames = (req, res) => {
    const games = readJSON("games.json");
    const rentals = readJSON("rentals.json");

    const availableGames = games.filter(game => {

        const isRented = rentals.some(r =>
            r.id_igrice === game.id_igrice && r.stvarni_datum_vracanja === null
        );

        return !isRented;

    });

    res.json(availableGames);

};

const filterGames = (req, res) => {
    const games = readJSON("games.json");
    const rentals = readJSON("rentals.json");

    const { zanr, platforma, minRating } = req.query;

    const gamesWithRating = games.map(game => {

        const gameRentals = rentals.filter(r =>
            r.id_igrice === game.id_igrice && r.ocena
        );

        const avgRating = gameRentals.length > 0 ?
            gameRentals.reduce((sum, r) => sum + r.ocena, 0) / gameRentals.length : 0;

        return {
            ...game,
            avgRating
        };

    });

    const filtered = gamesWithRating.filter(game => {

        const matchGenre = zanr ? game.zanr === zanr : true;
        const matchPlatform = platforma ? game.platforma === platforma : true;
        const matchRating = minRating ? game.avgRating >= Number(minRating) : true;

        return matchGenre && matchPlatform && matchRating;

    });

    res.json(filtered);

};

const getTopGames = (req, res) => {
    const games = readJSON("games.json");
    const rentals = readJSON("rentals.json");

    const gamesWithRating = games.map(game => {

        const gameRentals = rentals.filter(r =>
            r.id_igrice === game.id_igrice && typeof r.ocena === "number"
        );

        let avgRating = 0;

        if (gameRentals.length > 0) {
            const sum = gameRentals.reduce((total, r) => total + r.ocena, 0);
            avgRating = sum / gameRentals.length;
        }

        return {
            ...game,
            avgRating: Number(avgRating.toFixed(2))
        };
    });

    const topGames = gamesWithRating
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 3);

    res.json(topGames);
};

module.exports = {
    getAllGames,
    createGame,
    updateGame,
    deleteGame,
    getAvailableGames,
    filterGames,
    getTopGames
};




