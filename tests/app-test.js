var request = require('supertest');
var Application = require('../app.js');
var LOG = require('../lib/log.js');

var obj = {
    "Title": "Sample title",
    "Text": "Sample text",
    "Author": "Chris Colman",
    "Tags": ["a", "b"]};

describe('Server App testing', function () {
    var app;

    beforeEach(function (done) {
        var newApp = new Application();
        newApp.init(function (err) {
            app = newApp.app; // saving the express application itself to expose it to Supertest.
            done();
        });
    });

    it('#NewBook', function (done) {
        request(app)
            .post('/rest/newBook')
            .send(obj)
            .expect(200, done);
        LOG(done)
    });
    it('#Search', function (done) {
        request(app)
            .get('/rest/search?q=Sample title')
            .expect(200, done)
    });
    it('#AllBooks ', function (done) {
        request(app)
            .get('/rest/allBooks')
            .expect(200, done)
    });
});