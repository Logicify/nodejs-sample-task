var request = require('supertest');
var app = require('../app.js');

var obj = {
    "Title": "Sample title",
    "Text": "Sample text",
    "Author": "Chris Colman",
    "Tags": ["a", "b"]}

describe('Server App testing', function () {

    it('#NewBook', function (done) {
        request(app)
            .post('/rest/newBook')
            .send(obj)
            .expect(200, done);
        console.info(done)
    });
    it('#Search', function (done) {
        request(app)
            .get('/rest/search')
            .expect(200, done)
    });
    it('#AllBooks ', function (done) {
        request(app)
            .get('/rest/allBooks')
            .expect(200, done)
    });
});