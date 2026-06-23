const { readJSON } = require("../utils/fileHelper");

const getAllUsers = (req, res) => {
    const users = readJSON("users.json");
    res.json(users);
};

const getUserRentals = (req, res) => {
    const users = readJSON("users.json");
    const rentals = readJSON("rentals.json");
    const games = readJSON("games.json");

    const userId = parseInt(req.params.id);

    const user = users.find(u => u.id_korisnika === userId);
    if (!user) {
        return res.status(404).json({ message: "Korisnik ne postoji" });
    }

    const userRentals = rentals.filter(r => r.id_korisnika === userId);

    const result = userRentals.map(r => {

        const game = games.find(g => g.id_igrice === r.id_igrice);

        return {
            id_iznajmljivanja: r.id_iznajmljivanja,
            naziv_igrice: game ? game.naziv : "Nepoznata igrica",
            datum_preuzimanja: r.datum_preuzimanja,
            planirani_datum_vracanja: r.planirani_datum_vracanja,
            stvarni_datum_vracanja: r.stvarni_datum_vracanja,
            ukupna_cena: r.ukupna_cena,
            ocena: r.ocena
        };

    });

    res.json({
        korisnik: `${user.ime} ${user.prezime}`,
        rentals: result
    });

};

module.exports = {
    getUserRentals,
    getAllUsers
};