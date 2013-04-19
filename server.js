var auth = require('./auth');

var express = require('express');
var app = express();

var BookRestApi = require('./book/book-rest-api.js').BookRestApi;
var bookRestApi = new BookRestApi();

//function checkAuthentication(req, resp, next) {
//    if ("/authenticate" == req.url) {
//        next();
//        return;
//    }
//    if (!req.session.userId) {
//        console.log('Authenticaiton failed.');
//        resp.send(403, 'Authentication required');
//    } else {
//        console.log('Passing authentication.');
//        next();
//    }
//}
//
//function checkAuthorization(req, resp, next) {
//    // check ACLs for given entity.
//    next();
//    console.log("Authorization check.")
//}

var MemoryStore = express.session.MemoryStore;

//Configuration for errorHandler and others.
//TODO: maybe it's worth to publish all the public content under 'public' root so there's no confusion? (move to s3 later)
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('SomeSecret'));
app.use(express.session({ store: new MemoryStore({ reapInterval: 60000 * 10 }) }));
app.use(express.bodyParser());
//app.use('/rest', checkAuthentication);
//app.use('/rest', checkAuthorization);

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.use(auth({loginUrl: '/start'}));

//function authenticate(req, resp, next) {
//    if ((!req.body.username) || (!req.body.password)) {
//        resp.send(400, {"status": "failed", "code": 400});
//        return;
//    }
//    if ("admin" != req.body.username || "password" != req.body.password) {
//        resp.send(JSON.stringify({
//            "status": "Auth error: wrong username or password.",
//            "code": 403}));
//        return;
//    }
//
//    req.session.userId = 1;
//    req.session.userName = "Admin Admin";
//    resp.send({"status": 200, "message": "Successful login."});
//}

// mounting REST endpoints. All the other urls would be handled by static (coming from public folder).
//app.post('/rest/authenticate', authenticate);
app.get('/rest/allBooks', bookRestApi.findAllBooks);
app.post('/rest/newBook', bookRestApi.newBook);
app.get('/rest/search', bookRestApi.searchForBooks);
app.post('/rest/update', bookRestApi.update);
app.get('/rest/aa', function (req, res, next) {
    res.send({
        "status": "Auth error: wrong username or password.",
        "code": 403});
});

// Binding to port provided by Heroku, or to the default one.
var portToListenTo = process.env.PORT || 3000;
app.listen(portToListenTo);
console.log('Listening on port ' + portToListenTo);

module.exports = app;

