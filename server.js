var auth = require('./auth');

var express = require('express');
var app = express();

var BookRestApi = require('./book/book-rest-api.js').BookRestApi;
var bookRestApi = new BookRestApi();
var MemoryStore = express.session.MemoryStore;

//Configuration for errorHandler and others.
//TODO: maybe it's worth to publish all the public content under 'public' root so there's no confusion? (move to s3 later)
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('SomeSecret'));
app.use(express.session({ store: new MemoryStore({ reapInterval: 60000 * 10 }) }));
app.use(express.bodyParser());

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.use(auth({loginUrl: '/in', logoutUrl: '/out', excludeUrls: ['/favicon.ico']}));

// mounting REST endpoints. All the other urls would be handled by static (coming from public folder).
app.get('/rest/allBooks', bookRestApi.findAllBooks);
app.post('/rest/newBook', bookRestApi.newBook);
app.get('/rest/search', bookRestApi.searchForBooks);
app.post('/rest/update', bookRestApi.update);
app.get('/rest/aa', function (req, res, next) {
    res.send('Hello!');
});

// Binding to port provided by Heroku, or to the default one.
var portToListenTo = process.env.PORT || 3000;
app.listen(portToListenTo);
console.log('Listening on port ' + portToListenTo);

module.exports = app;

