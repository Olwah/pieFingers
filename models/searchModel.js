const mongoose = require('mongoose');
const validator = require('validator');

const searchSchema = new mongoose.Schema({
    searchString: {
        type: String
    },
    track: {
        type: String
    },
    artist: {
        type: String
    },
    album: {
        type: String
    }
});

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;
