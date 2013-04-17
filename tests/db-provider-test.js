var BookProvider = process.env['APP_COV']
    ? require('../book-cov/book-data-provider.js').BookProvider
    : require('../book/book-data-provider.js').BookProvider;
var should = require("chai");
var bookProvider = new BookProvider();

var testBook = {
    "Title": "Sample title",
    "Text": "Sample text",
    "Author": "Chris Colman",
    "Tags": ["a", "b"]
};
describe("REST API test", function () {

    before(function (done) {

        this.timeout(100);
        setTimeout(done, 50);
    });

    describe("#Find All Books", function () {

        it('should be return all db record', function (done) {
            bookProvider.findAll(function (error, data) {
                if (error) {
                    console.info(JSON.stringify({"error": error}))
                } else {
                    done();
                }
            });
        });
        it('should be save new record in DB', function (done) {

            bookProvider.save(testBook, function (error, book) {
                if (error) {
                    console.log('Error saving book. Mongodb: ' + error);
                } else {
                    console.log(JSON.stringify(book));
                    done();
                }
            })
        });
    });

});