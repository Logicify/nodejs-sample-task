var BookProvider = require('../book/book-data-provider.js').BookProvider;
var should = require("chai");
var bookProvider = BookProvider;
var LOG = require('../lib/log.js');

var testBook = {
    "Title": "Sample title",
    "Text": "Sample text",
    "Author": "Chris Colman",
    "Tags": ["a", "b"]

};
describe("REST API test", function () {

    before(function (done) {
        bookProvider.init(done);
    });

    describe("#Find All Books", function () {

        it('should be return all db record', function (done) {
            bookProvider.findAll(function (error, data) {
                if (error) {
                    LOG(JSON.stringify({"error": error}))
                } else {
                    done();
                }
            });
        });
        it('should be save new record in DB', function (done) {

            bookProvider.save(testBook, function (error, book) {
                if (error) {
                    LOG('Error saving book. Mongodb: ' + error);
                } else {
                    LOG(JSON.stringify(book));
                    done();
                }
            })
        });
    });

});