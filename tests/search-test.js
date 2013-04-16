
var Search = require('../book/book-search.js').Search;

describe("ElasticSearchClient Cluster apis", function () {

    before(function (done) {
        searchProvider = new Search();
        this.timeout(100);
        setTimeout(done, 50);
    });

    describe("#index", function () {
        var book = {
            "name": "test",
            "text": 'test test test test',
            "id": '11111111111111111111111'
        };

        it('should be create new record in a elasticSearch ', function (done) {
            searchProvider.index('book', book, book.id, null, function (data) {

            });
            done();
        });
    });
});
