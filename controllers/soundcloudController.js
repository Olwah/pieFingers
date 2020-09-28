const SC = require('node-soundcloud');

SC.init({
    id: 'your SoundCloud client ID',
    secret: 'your SoundCloud client secret',
    uri: 'your SoundCloud redirect URI',
});

// Connect user to authorize application
const initOAuth = (req, res) => {
    var url = SC.getConnectUrl();

    res.writeHead(301, { location: url });
    res.end();
};
