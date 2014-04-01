/**
 * dependencies
 */
var express = require('express'),
    async = require('async'),
    Search = require('./book/book-search.js').Search,
    DataProvider = require('./book/book-data-provider.js').BookProvider,
    LOG = require('./lib/log.js'),
    _config = require('./configuration'),
    config = _config.getConfiguration(),
    httpsConfig = _config.getHTTPSConfiguration(),
    https = require('https'),
    fs = require('fs'),
    validator = require('./lib/validator'),
    path = require('path'),
    mongoStore = require('connect-mongo')(express),
    storeConfig = _config.getStoreConfig(),
    _ = require('underscore');

/**
 * The Application
 *
 * @constructor
 */
function Application() {
    this.app = express();
}

/**
 * init Application
 *
 * @param {Function} cb Callback function
 */
Application.prototype.init = function (cb) {
    var self = this;

    async.series({
            "auth": self.authInit.bind(self),
            "configure": self.configure.bind(self),
            "initDatabase": DataProvider.init.bind(DataProvider),
            "initSearchProvider": Search.init.bind(Search),
            "mountAPI": self.mountAPI.bind(self)
        },
        function (err, callback) {
            if (err) {
                LOG('Error starting up the application. Exiting.');
                LOG(err);
                process.exit(1);
            }
            if (cb) {
                cb(err);
            }
        })
};

/**
 * init all features required for authentication
 *
 * there are:
 *  - valid user allowed to use application,
 *  - session settings,
 *  - basic authentication middleware with logout possibilities,
 *  - protectWithAuth() method is used for protecting `secret` routes
 *
 * @this {Application}
 * @param {Function} cb Callback function
 */
Application.prototype.authInit = function (cb) {

    //the only one user exists in the system for now
    var validUser = {
        name: "valid",
        pass: "user"
    };
    var self = this;

    //we need to use session here
    this.app.use(express.cookieParser(config.cookieParser.secret));
    // it is required to use external storage for session
    //we opt to use mongoDb
    this.app.use(
        express.session(_.extend(
            {},
            config.session,
            {store: new mongoStore(storeConfig)})));

    //we use basic auth
    var preAuth = function(req, res, next) {
        if (req.session.userLogOut) {
            delete req.headers.authorization;
            req.session.userLogOut = false;
        }
        next();
    };
    var message = ["****Use 'User Name':", validUser.name, "and Password:", validUser.pass].join(" ");
    var auth = express.basicAuth(function (user, pass) {
        return user === validUser.name && pass === validUser.pass;
    }, message);

    //define protectWithAuth method
    //it helps to protect different routes with auth
    this.protectWithAuth = function(route){
        self.app.all(route, preAuth, auth);
    };

    cb();
};

/**
 * mount book API routes
 *
 * @this {Application}
 * @param {Function} cb Callback function
 */
Application.prototype.mountAPI = function (cb) {
    var BookRestApi = require('./book/book-rest-api.js').BookRestApi;
    var bookRestApi = new BookRestApi();
    var bookValidationSchemas = require('./book/book-validation-schemas');

    //protect with auth
    if(this.protectWithAuth){
        this.protectWithAuth('/rest/*');
    }

    // mounting REST endpoints. All the other urls would be handled by static (coming from public folder).
    this.app.get('/rest/allBooks',
        validator.getMiddleware(bookValidationSchemas.findAllBooks),
        bookRestApi.findAllBooks);
    this.app.post('/rest/newBook',
        validator.getMiddleware(bookValidationSchemas.newBook),
        bookRestApi.newBook);
    this.app.get('/rest/search',
        validator.getMiddleware(bookValidationSchemas.searchForBooks),
        bookRestApi.searchForBooks);
    this.app.post('/rest/update',
        validator.getMiddleware(bookValidationSchemas.update),
        bookRestApi.update);
    cb();
};

/**
 * configure Application:
 *
 *  bind middlewares:
 *      - json parse
 *      - static routes
 *      - error handlers in different environments
 *
 *  bind logout route
 *
 * @this {Application}
 * @param {Function} cb Callback function
 */
Application.prototype.configure = function (cb) {
//Configuration for errorHandler and others.
    var self = this;

    this.app.use(express.favicon(path.join(__dirname, 'favicon.ico')));
    this.app.use(express.json());

    this.app.configure("development", "production", function () {
        //mount secure point
        //it forces all request to be redirected on HTTPS
        self.app.use(function (req, res, next) {
            if (!config.isHTTPS(req)) {
                var host = (config.https && config.https.port)
                        ? [config.host, ':', config.https.port] : [config.host];
                return res.redirect(['https://'].concat(host, [req.url]).join(''));
            }
            next();
        });
    });

    //protect static route
    if(this.protectWithAuth){
        this.protectWithAuth('/secret.html');
    }
    this.app.use(express.static(path.join(__dirname, 'public')));

    //mount logout point
    this.app.get('/logout', function (req, res) {
        req.session.userLogOut = true;
        res.redirect('/');
    });

    this.app.configure('development', function () {
        self.app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    this.app.configure('production', function () {
        self.app.use(express.errorHandler());
    });
    cb();
};

/**
 * bind server to listening on defined port
 *
 * @this {Application}
 * @param cb
 */
Application.prototype.bindServer = function (cb) {
// Binding to port provided by Heroku, or to the default one.
    this.app.listen(config.port, function (err) {
        LOG(['Application started on ULR http://', config.host, ':', config.port].join(''));
        if (cb) {
            cb(err);
        }
    });

};

Application.prototype.bindSecureServer = function(cb){
    //do we need to create and run secure server? - on Heroku it is redundant
    if (!httpsConfig){
        if(cb){
            async.nextTick(cb);
        }
        return;
    }

    //create secure server
    var self = this;
    var certData = {
        key: fs.readFileSync(httpsConfig.key),
        cert: fs.readFileSync(httpsConfig.cert)
    };
    //create server
    var secureServer = https.createServer(certData, self.app);
    //run server
    secureServer.listen(httpsConfig.port, function(err){
        LOG(['Secure server up and running on port: https://', config.host, ':', httpsConfig.port].join(''));
        if(cb){
            cb(err);
        }
    });
};


module.exports = Application;
