var request = require('supertest');
var app = require('../app.js');

describe('Server App testing', function () {

    it('newBook', function (done) {
        request(app)
            .post('/rest/newBook')
            .expect(200, done)
    });
    it('search', function (done) {
        request(app)
            .get('/rest/search')
            .expect(200, done)
    });
    it('allBooks ', function (done) {
        request(app)
            .get('/rest/allBooks')
            .expect(200, done)
    });
});