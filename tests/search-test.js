var Search = require('../book/book-search.js').Search;
var should = require("should");

var indexName = 'book';
var objName = 'document';
var json = {"id": "testId", name: "testName", text: "testText"};

var expect = require('chai').expect;

describe("ElasticSearchClient Cluster apis", function () {

    var searchProvider;

    before(function (done) {
        searchProvider = Search;
        Search.init(done);
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
                expect('data').to.exist;
                done();
            });
        });

        it('should be update test record ', function (done) {
            searchProvider.update(indexName, objName, "indexId", {doc: {tags: "testTags"}}, function (data) {
                data = JSON.parse(data);
                expect('data').to.exist;
                //data.ok.should.be.true;
                done();
            });
        });
    });

});
