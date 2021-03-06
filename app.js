// This file is only used to configure express

/**** CORE MODULES ****/
const path = require('path');
const express = require('express');

/**** 3RD PARTY MODULES ****/
const flash = require('express-flash');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Morgan is used for logging
const rateLimit = require('express-rate-limit'); // Prevents too many requests to the API e.g DoS
const helmet = require('helmet'); // Set HTTP headers
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const session = require('express-session'); // Session cookies for use with Spotify
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

/**** USER-CREATED MODULES ****/
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const authRouter = require('./routes/authRoutes');
const searchRouter = require('./routes/searchRoutes');
const spotifyRouter = require('./routes/spotifyRoutes');
const { RSA_NO_PADDING } = require('constants');

const app = express();

app.enable('trust proxy');

// Set PUG as template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Prevents bugs with '/' in the pathname

/**** GLOBAL MIDDLEWARE *****/
// These are middleware functions that will be run on all requests as no specific route has been declared.
// Implement CORS (Cross-Origin Resource Sharing)
// Access-Control-Allow-Origin *
app.use(cors());
// Specify the domains which can generate requests
/* app.use(cors({
    origin: 'https://wwwnatours.com'
})); */

// Can apply to all or a specific route
app.options('*', cors());
// app.options('/api.v1.tours/:id', cors());

// Serving static files on the web
app.use(express.static(path.join(__dirname, 'public')));

// Set HTTP headers
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'data:'],
            scriptSrc: [
                "'self'",
                'blob:',
                'https://*.cloudflare.com/',
                'https://*.jquery.com'
            ],
            //scriptSrcElem: ["'self'"],
            scriptSrcAttr: ["'none'"],
            frameSrc: [
                "'self'",
                'https://*.stripe.com/',
                'https://*.spotify.com'
            ],
            imgSrc: ["'self'", 'data:', 'https://*.scdn.co/'],
            workerSrc: ["'self'", 'data:', 'blob:'],
            connectSrc: ["'self'", 'blob:'],
            objectSrc: ["'none'"],
            styleSrc: ["'self'", 'https:', 'unsafe-inline'],
            upgradeInsecureRequests: [],
            blockAllMixedContent: []
        }
    })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit number of API requests from the same IP
const limiter = rateLimit({
    max: 100, // Allows 100 requests from the same IP
    windowMs: 60 * 60 * 1000, // 1hr in ms
    message: 'Too many requests from this IP. Please try again in an hour.'
});

// Apply only to '/api' route
app.use('/api', limiter);

// Body parser, reading data from body into 'req.body'
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Session cookie to persist data between http requests (server side)
/*
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        key: 'super-secret-cookie',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 }
    })
);
*/

// Session cookies (client side)
app.use(
    cookieSession({
        name: 'session',
        secret: process.env.COOKIE_SESSION_SECRET,
        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
);

// Adds req.flash(type, message) which we can use in our route handlers
app.use(flash());

// Data sanitisation against noSQL data injection
app.use(mongoSanitize()); // Filters out '$', '.' etc. from req.query, req.params & req.body

// Data sanitisation against XSS
app.use(xss()); // Cleans code from malicious HTML

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            // Enter data to whitelist here.
        ]
    })
);

app.use(compression());

// Serving static files on the web
app.use(express.static(`${__dirname}/public`));

/**** ROUTES *****/
app.use('/', viewRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/spotify', spotifyRouter);

// If we can reach this stage then the req/res cycle was not completed as middleware added to the stack in the order it's defined in our code. This catches all bad queries.
// .all() includes every http method or verb (get, patch, update, delete) & '*' denotes everything or all routes
app.all('*', (req, res, next) => {
    // When you pass in an argument to next() function, express automatically recognises it as an error and skips other middleware functions moving directly to the error handling middleware.
    // Creates a new error based on 'AppError' class.
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
// By specifying 'err' first express knows it's the error handling middleware.
app.use(globalErrorHandler);

module.exports = app;
