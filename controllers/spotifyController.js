const SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');
const url = require('url');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Search = require('../models/searchModel');

const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-library-modify',
    'user-follow-read',
    'user-follow-modify',
    'playlist-read-private',
    'playlist-modify-private'
];
const redirectUri = 'http://localhost:3000/api/v1/auth/spotify/login';
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
let authorizeURL;

let spotifyApi = new SpotifyWebApi();

/**** LOGIN / TOKEN FUNCTIONS ****/

// Used for the state parameter
const generateRandomString = (length) => {
    let text = '';
    let possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

exports.getAuthUrl = (req, res, next) => {
    // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
    spotifyApi = new SpotifyWebApi({
        redirectUri,
        clientId
    });
    const state = generateRandomString(16);

    // Create the authorization URL & redirect
    authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.redirect(authorizeURL);
};

exports.loginUser = (req, res, next) => {
    const credentials = {
        clientId,
        clientSecret,
        redirectUri
    };

    //const spotifyApi = new SpotifyWebApi(credentials);
    spotifyApi = new SpotifyWebApi(credentials);

    // The code that's returned as a query parameter to the redirect URI
    const code = req.query.code;

    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(
        function (data) {
            const accessToken = data.body.access_token;
            const refreshToken = data.body.refresh_token;

            if (process.env.NODE_ENV === 'development') {
                console.log(`The access token is ${accessToken}`);
                console.log(`The token expires in ${data.body.expires_in}`);
                console.log(`The refresh token is ${refreshToken}`);
            }

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);

            const query = querystring.stringify({
                accessToken,
                refreshToken
            });

            // Add the token to a cookie to use it in later calls
            req.session.spotify_access_token = accessToken;
            req.session.spotify_refresh_token = refreshToken;
            console.log(
                `spotify_access_token: ${req.session.spotify_access_token}`
            );
            console.log(
                `spotify_refresh_token: ${req.session.spotify_refresh_token}`
            );

            res.redirect(`http://localhost:3000/#${query}`);
        },
        function (err) {
            console.log('Something went wrong!', err);
            res.send({ error: 'invalid_token' });
        }
    );
};

exports.refreshToken = catchAsync(async (req, res, next) => {
    console.log(spotifyApi);
    console.log(`spotify_access_token: ${req.session.spotify_access_token}`);
    console.log(`spotify_refresh_token: ${req.session.spotify_refresh_token}`);

    // clientId, clientSecret and refreshToken has been set on the api object and session cookie previous to this call.
    if (
        !spotifyApi._credentials.accessToken &&
        !spotifyApi._credentials.refreshToken
    ) {
        spotifyApi._credentials.accessToken = req.session.spotify_access_token;
        spotifyApi._credentials.refreshToken =
            req.session.spotify_refresh_token;
    }

    const newToken = await spotifyApi.refreshAccessToken();

    if (!newToken) {
        return next(new AppError('Could not refresh access token', 400));
    }

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(newToken.body.access_token);
    req.session.spotify_access_token = newToken.body.access_token;

    console.log('The access token has been refreshed!');

    res.redirect(`http://localhost:3000`);
});

// Check is there is an access token on the spotifyApi or in the querystring
exports.checkSpotifyToken = catchAsync(async (req, res, next) => {
    if (!req.body.searchData.searchPlatforms.includes('spotify')) {
        next();
    } else {
        const { accessToken } = spotifyApi._credentials;
        if (!accessToken) {
            next(new AppError('Invalid or missing token', 404));
        }
    }
    next();
});

/**** USER DATA FUNCTIONS ****/

// Get logged-in user's data
exports.getCurrentUserData = catchAsync(async (req, res, next) => {
    const user = await spotifyApi.getMe();
    res.locals.display_name = user.body.display_name;
    res.locals.user_image = user.body.images[0].url;
    next();
});

/**** SEARCH FUNCTIONS ****/

// Search tracks whose name, album or artist matches search criteria
exports.searchAll = catchAsync(async (req, res, next) => {
    /*
    console.log(req.body);
    const { searchString } = req.body.searchData;

    const searchData = await spotifyApi.searchTracks(searchString);
    console.log(`searchData: ${searchData}`);
    
    console.log(`Search by "${searchString}"`, searchData.body);
    console.log(searchData.body.tracks.items[0]);
    */

    if (!req.body.searchData.searchPlatforms.includes('spotify')) {
        next();
    } else {
        const searchData = await Search.create(req.body.searchData);
        console.log(searchData);

        res.status(201).json({
            status: 'success',
            data: {
                data: searchData
            }
        });
    }
});

exports.searchTrackArtist = catchAsync(async (req, res, next) => {
    if (!req.body.searchData.searchPlatforms.includes('spotify')) {
        next();
    } else {
        const searchData = await Search.create(req.body.searchData);
        console.log(searchData);

        // 201 code means 'written'
        res.status(201).json({
            status: 'success',
            data: {
                data: searchData
            }
        });
    }
});

exports.getSearchType = catchAsync(async (req, res, next) => {
    // Advanced search
    if (
        req.params.hasOwnProperty('track') &&
        req.params.hasOwnProperty('artist')
    ) {
        const { track, artist } = req.params;
        const results = await spotifyApi.searchTracks(
            `track:${track} artist:${artist}`
        );
        return results;
    }

    // Basic search
    if (req.params.hasOwnProperty('searchString')) {
        const { searchString } = req.params;
        const results = await spotifyApi.searchTracks(searchString);
        return results;
    }
    next();  
});

// Search tracks whose artist's name contains value from searchFieldArtist input, and track name contains value from searchFieldTrack input
exports.getTrackArtist = catchAsync(async (req, res, next) => {
    //const { searchData } = req.body;
    //const { track, artist } = searchData;

    /*
    if (
        req.params.hasOwnProperty('track') &&
        req.params.hasOwnProperty('artist')
    ) {
        const { track, artist } = req.params;
        const results = await spotifyApi.searchTracks(
            `track:${track} artist:${artist}`
        );
    }

    if (req.params.hasOwnProperty('searchString')) {
        const { searchString } = req.params;
        const results = await spotifyApi.searchTracks(searchString);
    }
    */

    const items = results.body.tracks.items;
    console.log(items);

    // Initiate the array with the number of results returned
    let resultData = [];
    for (let i = 0; i < items.length; i++) {
        // Grab result number
        const number = i + 1;

        // Deconstruct the items array at position i to retrieve useful track data to display
        const { name, id, preview_url, uri, href } = items[i];
        const trackName = name;

        // Grab artist data and package into an object
        const artists = items[i].artists[0];
        const artistName = artists.name;
        const artistHref = artists.href;
        const artistId = artists.id;
        const artistUri = artists.uri; // used for sharing
        const artistObj = { artistName, artistHref, artistId, artistUri };

        // Grab the first image from the album to display
        const imgUrl = items[i].album.images[0].url;

        // Place all data for the track into an object and push the object to the resultData array
        const trackObj = {
            number,
            trackName,
            artistObj,
            imgUrl,
            id,
            preview_url,
            uri,
            href
        };
        resultData.push(trackObj);
    }
    console.log(resultData);

    // Save userData and pass to template
    const userData = res.locals;

    res.render('searchResults', {
        title: 'Search Results',
        resultData,
        userData
    });
});

/**** USER LIBRARY FUNCTIONS ****/

// Check if tracks are in the signed in user's Your Music library
exports.checkUserLibraryForTracks = catchAsync(async (req, res, next) => {
    const savedTracks = await spotifyApi.containsMySavedTracks([
        `${req.body.trackId}`
    ]);

    // An array is returned, where the first element corresponds to the first track ID in the query
    var trackIsInYourMusic = savedTracks.body[0];
    console.log(trackIsInYourMusic);

    if (trackIsInYourMusic) {
        console.log("Track was found in the user's Your Music library");
    } else {
        console.log('Track was not found. Proceeding with request...');
        next();
    }
});

// Add tracks to the signed in user's Your Music library
exports.addTrackToUserLibrary = catchAsync(async (req, res, next) => {
    console.log(req.body.trackId);
    const addTrack = await spotifyApi.addToMySavedTracks([
        `${req.body.trackId}`
    ]);

    res.status(201).json({
        status: 'success',
        data: {
            data: addTrack
        }
    });
});
