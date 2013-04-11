var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Sample application (Node.js, mongodb, elastic search, ext.js)');
});

app.listen(3000);
console.log('Listening on port 3000');

