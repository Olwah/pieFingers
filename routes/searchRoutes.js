const express = require('express');
const viewsController = require('../controllers/viewsController');
const spotifyController = require('../controllers/spotifyController');

const router = express.Router();

router.use(viewsController.alerts);

router
    .route('/results/searchString/:searchString')
    .post(spotifyController.checkSpotifyToken,spotifyController.newSearch)
    .get(
        spotifyController.getCurrentUserData,
        spotifyController.getSearchType,
        spotifyController.getTrackArtist
    );

router
    .route('/results/track/:track/artist/:artist')
    .post(
        spotifyController.checkSpotifyToken,
        spotifyController.newSearch
    )
    .get(
        spotifyController.getCurrentUserData,
        spotifyController.getSearchType,
        spotifyController.getTrackArtist
    );

module.exports = router;
