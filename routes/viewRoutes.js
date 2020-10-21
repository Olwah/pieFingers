const express = require('express');
const viewsController = require('../controllers/viewsController');
const spotifyController = require('../controllers/spotifyController');

const router = express.Router();

// HOMEPAGE
router.get('/', viewsController.getHome);

// DISPLAY RESULTS
router.get('/results', viewsController.displaySearchResults);

// SPOTIFY
router.get('/spotify/login', viewsController.getSpotifyLogin);



module.exports = router;