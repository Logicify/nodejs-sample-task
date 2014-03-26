var Search = require('../book/book-search.js').Search,
    should = require("should"),
    expect = require('chai').expect;

describe("ElasticSearchClient Cluster apis", function () {

    var searchProvider;
    var FakeIndex = function(id){
        this.toHexString = function(){
            return id;
        }
    };
    var json = {"id": "testId", name: "testName", Text: "testText", _id: new FakeIndex("indexId"), Tags: ["a", "b"]};

    before(function (done) {
        searchProvider = Search;
        Search.init(done);
    });

    describe("#Elastic", function () {

        it('should be create new record', function (done) {
            searchProvider.index(json, done);
        });

        it('should be search test record ', function (done) {
            var query = "test";
            searchProvider.search(query, {}, function (error, data) {
                data = JSON.parse(data);
                expect(data).to.exist;
                done();
            });
        });

        it('should be update test record ', function (done) {
            searchProvider.update({Tags: ["testTags"], _id: "indexId"}, function (error, data) {
                data = JSON.parse(data);
                expect(data).to.exist;
                //data.ok.should.be.true;
                done();
            });
        });
    });
});
