const express = require('express');
const spotifyController = require('../controllers/spotifyController');

const router = express.Router();

router
    .route('/add-track-to-library')
    .post(spotifyController.checkUserLibraryForTracks, spotifyController.addTrackToUserLibrary);

module.exports = router;