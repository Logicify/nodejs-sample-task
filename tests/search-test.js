var Search = process.env['APP_COV']
    ? require('../book-cov/book-search.js').Search
    : require('../book/book-search.js').Search;
var should = require("chai");

var indexName = 'book';
var objName = 'document';
var json = {"id": "testId", name: "testName", text: "testText"};

describe("ElasticSearchClient Cluster apis", function () {

    before(function (done) {
        searchProvider = new Search();
        this.timeout(100);
        setTimeout(done, 50);
    });

    describe("#Elastic", function () {

        it('should be create new record', function (done) {
            searchProvider.index(indexName, objName, json, 'indexId', null, function (data) {
                done();
            });
        });

        it('should be search test record ', function (done) {
            var qryObj = {
                "query": {
                    "term": { "name": "test" }
                }
            };
            searchProvider.search(indexName, objName, qryObj, null, function (data) {
                data = JSON.parse(data);
                done();
            });
        });

        it('should be update test record ', function (done) {
            searchProvider.update(indexName, objName, "indexId", {doc: {tags: "testTags"}}, function (data) {
                data = JSON.parse(data);
                done();
            });
        });
    });

});
