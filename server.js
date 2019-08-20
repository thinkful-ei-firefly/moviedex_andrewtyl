const express = require('express');
const app = express();
const morgan = require('morgan');
const movieDatabase = require('./dev-movies-data');

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res
        .status(400)
        .send(`Please use GET /movie`);
});

const port = 8080;

app.listen(port, () => {
    console.log(`Express loaded at http://localhost:${port}`);
})

app.get('/allMovies', (req, res) => {
    res.send(movieDatabase);
})

app.get('/movie', (req, res) => {
    let responseSent = false;
    let { genre, country, avg_vote } = req.query;
    let returnMovies = [];

    if (!genre && !country && !avg_vote) {
        responseSent = true;
        res
            .status(403)
            .send(`This request would send the entire database to you. Please include genre, country, or avg_vote if this is not what you wanted. Otherwise, please send the request again on /allMovies`);
    }

    if (genre) {
        genre = genre.toLowerCase();
        for (let i = 0; i < movieDatabase.length; i++) {
            let currentFilm = movieDatabase[i];
            let currentFilmGenre = currentFilm.genre.toLowerCase();
            if (currentFilmGenre.includes(genre)) {
                returnMovies.push(currentFilm);
            }
        }
    }
    else {
        returnMovies = movieDatabase;
    }

    if (country) {
        country = country.toLowerCase();
        let newReturnMovies = [];
        for (let i = 0; i < returnMovies.length; i++) {
            let currentFilm = returnMovies[i];
            let currentFilmCountry = currentFilm.country.toLowerCase();
            if (currentFilmCountry.includes(country)) {
                newReturnMovies.push(currentFilm);
            }
        }
        returnMovies = newReturnMovies;
    }

    if (avg_vote) {
        let newReturnMovies = [];
        avg_vote = parseInt(avg_vote);

        if ((avg_vote < 0) || (avg_vote > 10)) {
            responseSent = true;
            res
                .status(400)
                .send(`Please set avg_vote to a number between 0 and 10.`)
        }
        else {
            for (let i = 0; i < returnMovies.length; i++) {
                let currentFilm = returnMovies[i];
                if (currentFilm.avg_vote >= avg_vote) {
                    newReturnMovies.push(currentFilm);
                };
            };
            returnMovies = newReturnMovies;
        }
    }

    if (responseSent === false) {
        if (!(returnMovies[0])) {
            res
                .status(200)
                .send(`No results found. Please check your search queries.`);
        }
        else {
            res
                .status(200)
                .send(returnMovies);
        }
    }
});