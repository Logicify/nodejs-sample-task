var BookProvider = require('./bookprovider.js').BookProvider;
var express = require('express');

var app = express();

//Configuration for errorHandler and others.
app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


app.get('/rest/allBooks', function (req, res) {
    new BookProvider().findAll(function (error, data) {
        if (error) {
            res.send(JSON.stringify({"error": error}))
        } else {
            res.send(JSON.stringify(data));
        }
    });
})

app.listen(3000);
console.log('Listening on port 3000');

