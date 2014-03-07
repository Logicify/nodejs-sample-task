var express = require('express'),
    async = require('async'),
    Search = require('./book/book-search.js').Search,
    DataProvider = require('./book/book-data-provider.js').BookProvider,
    LOG = require('./lib/log.js');

function Application() {
    this.app = express();
}

Application.prototype.init = function (cb) {
    var self = this;

    async.series({
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


Application.prototype.mountAPI = function (cb) {
    var BookRestApi = require('./book/book-rest-api.js').BookRestApi;
    var bookRestApi = new BookRestApi();

    // mounting REST endpoints. All the other urls would be handled by static (coming from public folder).
    this.app.get('/rest/allBooks', bookRestApi.findAllBooks);
    this.app.post('/rest/newBook', bookRestApi.newBook);
    this.app.get('/rest/search', bookRestApi.searchForBooks);
    this.app.post('/rest/update', bookRestApi.update);
    cb();
};

Application.prototype.configure = function (cb) {
//Configuration for errorHandler and others.
    var self = this;
    this.app.configure(function () {
        self.app.use(express.static(__dirname + '/public'));
        self.app.use(express.json());
    });

    this.app.configure('development', function () {
        self.app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    this.app.configure('production', function () {
        self.app.use(express.errorHandler());
    });
    cb();
};

Application.prototype.bindServer = function (cb) {
// Binding to port provided by Heroku, or to the default one.
    var portToListenTo = process.env.PORT || 3000;
    this.app.listen(portToListenTo, function (err, server) {
        LOG('Application started on ULR http://localhost:' + portToListenTo);
        if (cb) {
            cb(err);
        }
    });

};


module.exports = Application;
