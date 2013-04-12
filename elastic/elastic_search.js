var ElasticSearchClient = require('elasticsearchclient'), url = require('url');

var serverOptions = {
    host: "10.10.1.4",
    port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

exports.index = function (indexName, typeName, document, id, options, cb) {
    elasticSearchClient.index(indexName, typeName, document, id, options, cb).on('data',
        function (data) {
            cb(data)
        }).exec();
};

exports.search = function (indexName, typeName, queryObj, options, cb) {
    elasticSearchClient.search(indexName, typeName, queryObj, options, cb).on('data',
        function (data) {
            cb(data)
        }).on('error',function (error) {
            cb (error)
        }).exec();
};

