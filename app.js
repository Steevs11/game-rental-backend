const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Projekat2IST backend radi");
});

const usersRoutes = require("./routes/usersRoutes");
app.use("/users", usersRoutes);

const gamesRoutes = require("./routes/gamesRoutes");
app.use("/games", gamesRoutes);

const rentalsRoutes = require("./routes/rentalsRoutes");
app.use("/rentals", rentalsRoutes);

module.exports = app;