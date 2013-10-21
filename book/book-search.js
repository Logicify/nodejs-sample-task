var ElasticSearchClient = require('elasticsearchclient'),
    util = require('util'),
    LOG = require('../lib/log.js');

/**
 * Search api provider for books.
 *
 * @constructor default
 */
Search = function () {
};

Search.prototype.init = function (cb) {
    //TODO: generify it, as we'll have other types of objects.
    var bonsaiHost;
    var serverOptions = null;

    if (process.env.BONSAI_URL) {
        bonsaiHost = process.env.BONSAI_URL;
        var match = /http:\/\/(\w+):(\w+)@(.+)/g.exec(bonsaiHost);
        serverOptions = {};

        serverOptions.auth = match[1] + ":" + match[2];
        serverOptions.host = match[3];
        serverOptions.port = 80;

        LOG("Env var for bonsai is " + bonsaiHost);
        LOG("Server options are  " + JSON.stringify(serverOptions));
    } else {
        serverOptions = {
            host: "localhost",
            port: 9200
        };
        LOG(util.format("Connecting to local ElasticSearch (%j)", serverOptions));
    }

    this.elasticSearchClient = new ElasticSearchClient(serverOptions);
    var qryObj = {
        "query": {
            "query_string": {
                "query": 'any'
            }
        }
    };
    this.search('book', 'document', qryObj, null, function (data) {
        var elasticResponse = JSON.parse(data);
        cb(elasticResponse.error);
    });
};

Search.prototype.index = function (indexName, typeName, document, id, options, cb) {
    this.elasticSearchClient
        .index(indexName, typeName, document, id, options, cb).on('data',function (data) {
            cb(data)
        }
    ).exec();

    this.elasticSearchClient.update()
};

Search.prototype.search = function (indexName, typeName, queryObj, options, cb) {
    this.elasticSearchClient
        .search(indexName, typeName, queryObj, options, cb).on('data',function (data) {
            cb(data)
        }).on('error',function (error) {
            cb(error)
        }).exec();
};

Search.prototype.update = function (indexName, typeName, mongoDocId, doc, cb) {
    this.elasticSearchClient
        .update(indexName, typeName, mongoDocId, {doc: doc}, null, cb).on('data',function (data) {
            LOG(data);
            cb(data)
        }).on('error',function (error) {
            LOG(error);
            cb(error)
        }).exec();
};

exports.Search = new Search();

