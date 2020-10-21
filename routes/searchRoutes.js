const express = require('express');
const viewsController = require('../controllers/viewsController');
const spotifyController = require('../controllers/spotifyController');

const router = express.Router();

router.use(viewsController.alerts);

router
    .route('/results/:searchString')
    .post(spotifyController.checkSpotifyToken, spotifyController.searchAll)
    .get(
        spotifyController.getCurrentUserData,
        spotifyController.getSearchType,
        spotifyController.getTrackArtist
    );

router
    .route('/results/track/:track/artist/:artist')
    .post(
        spotifyController.checkSpotifyToken,
        spotifyController.searchTrackArtist
    )
    .get(
        spotifyController.getCurrentUserData,
        spotifyController.getTrackArtist
    );

module.exports = router;
