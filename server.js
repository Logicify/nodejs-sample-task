var express = require('express');

var BookProvider = require('./bookprovider.js').BookProvider;
var Search = require('./search.js').Search;

var app = express();

var bookProvider = new BookProvider();
var search = new Search();

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

    bookProvider.save(req.body, function (error, bookSaved) {
        if (error) {
            res.send(400, 'Error saving book!');
        } else {
            res.send('OKAY, saved book.');
            var querySave = {
                "name": bookSaved.name,
                "text": [bookSaved.Text, bookSaved.Title, bookSaved.Author, bookSaved.Tags.join(" ")].join(" "),
                "id": bookSaved._id
            }
            search.index('book', 'document', querySave, null, null, function (data) {
                console.info(JSON.stringify(data));
                bookId = data._id
            })
        }
    })
});


app.get('/rest/search', function (req, res) {
    var qryObj = {
        "query": {
            "query_string": {
                "query": req.query.id
            }
        }
    };
    search.search('book', 'document', qryObj, null, function (data) {
        var hits = JSON.parse(data).hits.hits;
        console.log(hits.length + " hits found for query " + req.query.id)
        var ids = hits.map(function (hit) {
            return hit._source.id;
        });
        bookProvider.findByIds(ids, function (err, data) {
            if (err) {
                res.send("Error");
                return;
            }
            res.send(data)
        });

    });
});


var portToListenTo = process.env.PORT || 3000;
console.log('About to listen on port ' + portToListenTo);

app.listen(portToListenTo);
console.log('Listening on port ' + portToListenTo);

