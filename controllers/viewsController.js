const AppError = require('../utils/appError');

exports.getHome = (req, res, next) => {
    res.status(200).render('home', {
        title: 'pieFingers | Home'
    });
}