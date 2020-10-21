const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    /*
    if (alert === 'booking')
        res.locals.alert =
            "Your booking was successful! Please check your email for confirmation. If your booking doesn't show up immediately, please come back later.";
    */
    next();
};

exports.getHome = (req, res, next) => {
    res.status(200).render('base', {
        title: 'Home',
    });
};

exports.getSpotifyLogin = (req, res, next) => {
    res.status(200).render('spotifyLogin', {
        title: 'Spotify Login',
    });
};

exports.displaySearchResults = (req, res, next) => {
    const resultData = res.locals.resultData;
    console.log(resultData);
    console.log(`req.params: ${req.params}`);
    
    res.status(200).render('searchResults', {
        title: 'Search Results',
        resultData
    });
};
