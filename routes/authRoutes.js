const express = require('express');
const spotifyController = require('../controllers/spotifyController');

const router = express.Router();

// SPOTIFY
router.get('/spotify/getAuthUrl', spotifyController.getAuthUrl);
router.get('/spotify/login', spotifyController.loginUser);
router.get('/spotify/refreshToken', spotifyController.refreshToken);

module.exports = router;
