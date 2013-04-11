var express = require('express');
var app = express();

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

app.get('/rest/*', function (req, res) {
    res.send('Future REST api.');
})

app.listen(3000);
console.log('Listening on port 3000');

