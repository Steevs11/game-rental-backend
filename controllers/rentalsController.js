const { readJSON, writeJSON } = require("../utils/fileHelper");

const createRental = (req, res) => {
    const rentals = readJSON("rentals.json");
    const games = readJSON("games.json");
    const users = readJSON("users.json");

    const {
        id_igrice,
        id_korisnika,
        datum_preuzimanja,
        planirani_datum_vracanja
    } = req.body;

    const game = games.find(g => g.id_igrice === id_igrice);
    if (!game) {
        return res.status(404).json({ message: "Igrica ne postoji" });
    }

    // Kreiranje korisnika ako ne postoji
    let user = users.find(u => u.id_korisnika === id_korisnika);

    if (!user) {
        user = {
            id_korisnika,
            ime: req.body.ime,
            prezime: req.body.prezime,
            email: req.body.email,
            telefon: req.body.telefon
        };

        users.push(user);
        writeJSON("users.json", users);
    }

    const start = new Date(datum_preuzimanja);
    const end = new Date(planirani_datum_vracanja);

    if (end <= start) {
        return res.status(400).json({ message: "Neispravan datum" });
    }

    const diffTime = end - start;
    const days = diffTime / (1000 * 60 * 60 * 24);

    const ukupna_cena = days * game.cena_po_danu;


    const newRental = {
        id_iznajmljivanja: rentals.length ? rentals[rentals.length - 1].id_iznajmljivanja + 1 : 1,
        id_igrice,
        id_korisnika,
        datum_preuzimanja,
        planirani_datum_vracanja,
        stvarni_datum_vracanja: null,
        ukupna_cena,
        ocena: null
    };

    rentals.push(newRental);
    writeJSON("rentals.json", rentals);

    res.status(201).json(newRental);

};

const getAllRentals = (req, res) => {
    const rentals = readJSON("rentals.json");
    res.json(rentals);
};

const returnRental = (req, res) => {
    const rentals = readJSON("rentals.json");
    const games = readJSON("games.json");
    const id = parseInt(req.params.id);

    const rental = rentals.find(r => r.id_iznajmljivanja === id);

    if (!rental) {
        return res.status(404).json({ message: "Rental nije pronadjen" });
    }

    if (rental.stvarni_datum_vracanja) {
        return res.status(400).json({ message: "Igrica je vec vracena" });
    }

    const game = games.find(g => g.id_igrice === rental.id_igrice);
    if (!game) {
        return res.status(404).json({ message: "Igrica za ovaj rental ne postoji" });
    }

    const actual = new Date(req.body.stvarni_datum_vracanja);
    if (isNaN(actual)) {
        return res.status(400).json({ message: "Neispravan datum vracanja" });
    }

    const planned = new Date(rental.planirani_datum_vracanja);

    if (actual > planned) {
        const diff = actual - planned;
        const lateDays = diff / (1000 * 60 * 60 * 24);

        rental.ukupna_cena += lateDays * game.cena_po_danu;
    }

    rental.stvarni_datum_vracanja = req.body.stvarni_datum_vracanja;
    rental.ocena = req.body.ocena;

    writeJSON("rentals.json", rentals);

    res.json(rental);

};

const getActiveRentals = (req, res) => {
    const rentals = readJSON("rentals.json");
    const games = readJSON("games.json");
    const users = readJSON("users.json");

    const activeRentals = rentals.filter(r => r.stvarni_datum_vracanja === null).map(r => {

        const game = games.find(g => g.id_igrice === r.id_igrice);
        const user = users.find(u => u.id_korisnika === r.id_korisnika);

        return {
            id_iznajmljivanja: r.id_iznajmljivanja,
            naziv_igrice: game ? game.naziv : "Nepoznata igrica",
            korisnik: user ? `${user.ime} ${user.prezime}` : "Nepoznat korisnik",
            planirani_datum_vracanja: r.planirani_datum_vracanja
        };

    });

    res.json(activeRentals);

};

const getGameHistory = (req, res) => {
    const rentals = readJSON("rentals.json");
    const games = readJSON("games.json");

    const gameId = parseInt(req.params.id_igrice);
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ message: "Moraju postojati start i end datumi" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: "Neispravni datumi" });
    }

    if (startDate > endDate) {
        return res.status(400).json({ message: "Start datum ne moze biti posle end datuma" });
    }

    const gameExists = games.find(g => g.id_igrice === gameId);
    if (!gameExists) {
        return res.status(404).json({ message: "Igrica ne postoji" });
    }

    const history = rentals.filter(r => {
        const rentalDate = new Date(r.datum_preuzimanja);

        return (
            r.id_igrice === gameId &&
            rentalDate >= startDate &&
            rentalDate <= endDate
        );
    });

    res.json(history)

}

module.exports = {
    createRental,
    returnRental,
    getAllRentals,
    getActiveRentals,
    getGameHistory
};




