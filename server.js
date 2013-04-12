var express = require('express');
var app = express();

var BookRestApi = require('./book/book-rest-api.js').BookRestApi;
var bookRestApi = new BookRestApi();

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

// mounting REST endpoints. All the other urls would be handled by static (coming from public folder).
app.get('/rest/allBooks', bookRestApi.findAllBooks);
app.post('/rest/newBook', bookRestApi.newBook);
app.get('/rest/search', bookRestApi.searchForBooks);
app.post('/rest/update', bookRestApi.update);

// Binding to port provided by Heroku, or to the default one.
var portToListenTo = process.env.PORT || 3000;
app.listen(portToListenTo);
console.log('Listening on port ' + portToListenTo);

