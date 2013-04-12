var ElasticSearchClient = require('elasticsearchclient'), url = require('url');

Search = function () {
    var serverOptions = {
        host: "localhost",
        port: 9200
    };

    this.elasticSearchClient = new ElasticSearchClient(serverOptions);
};


Search.prototype.index = function (indexName, typeName, document, id, options, cb) {
    this.elasticSearchClient
        .index(indexName, typeName, document, id, options, cb).on('data',function (data) {
            cb(data)
        }
    ).exec();
};

Search.prototype.search = function (indexName, typeName, queryObj, options, cb) {
    this.elasticSearchClient
        .search(indexName, typeName, queryObj, options, cb).on('data',function (data) {
            cb(data)
        }).on('error',function (error) {
            cb(error)
        }).exec();
};

exports.Search = Search;

