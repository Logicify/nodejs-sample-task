var BookProvider = require('./bookprovider.js').BookProvider;
var express = require('express');

var app = express();

var bookProvider = new BookProvider();

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

// to get all the books -- testing.
app.get('/rest/allBooks', function (req, res) {
    bookProvider.findAll(function (error, data) {
        if (error) {
            res.send(JSON.stringify({"error": error}))
        } else {
            res.send(JSON.stringify(data));
        }
    });
});

// to submit a new book for storage.
app.post('/rest/newBook', function (req, res) {
    if (!req.body) {
        res.send(400, "Wrong format - maybe malformed json?");
        return;
    }

    //TODO vadim, here store the document to the elasticsearch.
    bookProvider.save(req.body, function (error, bookSaved) {
        if (error) {
            res.send(400, 'Error saving book!');
        } else {
            res.send('OKAY, saved book.');
        }
    })
});

var portToListenTo = process.env.PORT | 3000;
console.log('About to listen on port ' + portToListenTo);

app.listen(portToListenTo);
console.log('Listening on port ' + portToListenTo);

