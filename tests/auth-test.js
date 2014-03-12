var request = require('supertest');
    Application = require('../app.js');
    LOG = require('../lib/log.js');

describe('Server Auth testing', function () {
    var app;

    beforeEach(function (done) {
        var newApp = new Application();
        newApp.init(function (err) {
            app = newApp.app; // saving the express application itself to expose it to Supertest.
            done();
        });
    });

    it('should open start page', function (done) {
        request(app)
            .get('/index.html')
            .expect(200, done);
    });
    it('should through auth error on search', function (done) {
        request(app)
            .get('/rest/search?q=Sample title')
            .expect(401, done)
    });
    it('should through auth error on getAll', function (done) {
        request(app)
            .get('/rest/allBooks')
            .expect(401, done)
    });
});
