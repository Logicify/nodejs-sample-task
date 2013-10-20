var express = require('express'),
    async = require('async'),
    Search = require('./book/book-search.js').Search,
    DataProvider = require('./book/book-data-provider.js').BookProvider;
var app = express();

function mountAPI(cb) {
    var BookRestApi = require('./book/book-rest-api.js').BookRestApi;
    var bookRestApi = new BookRestApi();

    // mounting REST endpoints. All the other urls would be handled by static (coming from public folder).
    app.get('/rest/allBooks', bookRestApi.findAllBooks);
    app.post('/rest/newBook', bookRestApi.newBook);
    app.get('/rest/search', bookRestApi.searchForBooks);
    app.post('/rest/update', bookRestApi.update);
    cb();
}

function configure(cb) {
//Configuration for errorHandler and others.
    app.configure(function () {
        app.use(express.static(__dirname + '/public'));
        app.use(express.json());
    });

    app.configure('development', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function () {
        app.use(express.errorHandler());
    });
    cb();
}

function bindServer(cb) {
// Binding to port provided by Heroku, or to the default one.
    var portToListenTo = process.env.PORT || 3000;
    app.listen(portToListenTo, function (err, server) {
        console.log('Application started on ULR http://localhost:' + portToListenTo);
        cb(err);
    });

}


function startSequence() {
    async.series({
            "configure": configure,
            "initDatabase": DataProvider.init.bind(DataProvider),
            "initSearchProvider": Search.init.bind(Search),
            "mountAPI": mountAPI,
            "bindServer": bindServer
        },
        function (err, callback) {
            if (err) {
                console.log('Error starting up the application. Exiting.');
                console.log(err);
                process.exit(1);
            }
        })
}

startSequence();

module.exports = app;

