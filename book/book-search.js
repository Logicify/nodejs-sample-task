/**
 * dependencies
 */
var ElasticSearchClient = require('elasticsearchclient'),
    util = require('util'),
    LOG = require('../lib/log.js'),
    config = require('../configuration').getElasticConfiguration(),
    async = require("async");

/**
 * Search api provider for books.
 *
 * @constructor
 */
Search = function () {
};

/**
 * Names used as elasticSearch parameters
 *
 * @type {{INDEX: string, TYPE: string}}
 */
var NAMES = {
    INDEX: "book",
    TYPE: "document"
};

/**
 * method to map book into search format
 *
 * @param {Object} book Book object
 * @returns {{name: *, text: *, id: *}}
 */
function mapBookToSearchFormat(book) {
    console.log(book);
    return {
        "name": book.name,
        "text": [book.Text, book.Title, book.Author, book.Tags.join(" ")].join(" "),
        "id": book._id
    }
}

/**
 * init Search
 * - it makes connection with elastic server
 *
 * @this {Search}
 * @param {Function} cb Callback function
 */
Search.prototype.init = function (cb) {
    //TODO: generify it, as we'll have other types of objects.

    LOG(util.format("Connecting to ElasticSearch (%j)", config));

    this.elasticSearchClient = new ElasticSearchClient(config);

    async.nextTick(cb);
};

/**
 * update index with new book object
 *
 * @this {Search}
 * @param {bookModel} book Book to put into search index
 * @param {Function} cb Callback function
 */
Search.prototype.index = function (book, cb) {

    this.elasticSearchClient
        .index(NAMES.INDEX, NAMES.TYPE, mapBookToSearchFormat(book), book._id.toHexString(), {}, cb)
        .on('data', function (data) {
            var parsedData = JSON.parse(data);
            cb(parsedData.error, data);
        })
        .on('error', cb)
        .exec();

    this.elasticSearchClient.update();
};

/**
 * search by query specified
 *
 * @this {Search}
 * @param {String} query Query to find books
 * @param {Object} options
 * @param {Function} cb Callback funciton
 */
Search.prototype.search = function (query, options, cb) {
    //create search queryObj
    var queryObj = {
        query: {
            "query_string": {
                "query": query
            }
        }
    };

    this.elasticSearchClient
        .search(NAMES.INDEX, NAMES.TYPE, queryObj, options, cb)
        .on('data', function (data) {
            var parsedData = JSON.parse(data);
            cb(parsedData.error, data);
        })
        .on('error', cb)
        .exec();
};

/**
 * update book indexes
 *
 * @this {Search}
 * @param {bookModel} book Book to update
 * @param {Function} cb Callback function
 */
Search.prototype.update = function (book, cb) {
    this.elasticSearchClient
        .update(NAMES.INDEX, NAMES.TYPE, book._id, {doc: mapBookToSearchFormat(book)}, null, cb)
        .on('data',function (data) {
            LOG(data);
            cb(null, data);
        }).on('error',function (error) {
            LOG(error);
            cb(error);
        }).exec();
};

/**
 * drop all books from the search
 *
 * @this {Search}
 * @param {Function} cb Callback function
 */
Search.prototype.dropAll = function (cb) {

    this.elasticSearchClient
        .deleteDocument("book")
        .on("data", function (data) {
            var error = JSON.parse(data).error;
            if (!error) {
                LOG("All indexes have been dropped out");
            }
            cb(error);
        })
        .on("error", cb)
        .exec();
};

/**
 * setup index and mapping
 * it uses check path if index is not defined yet
 *
 * @this {Search}
 * @param {Function} cb Callback function
 */
Search.prototype.setupIndex = function (cb) {
    var self = this;

    async.auto({
        "isNewIndex": function (cb1) { //check if index exists
            self.elasticSearchClient.count(
                    NAMES.INDEX,
                    NAMES.TYPE,
                    "",
                    null
                )
                .on("data", function (data) {
                    var parsedData = JSON.parse(data),
                        status = parsedData.status;
                    if (status == "404") {
                        cb1(null, true);
                        return;
                    }
                    cb1(parsedData.error);
                })
                .on("error", cb1)
                .exec();
        },
        "ifNewIndexCreate": ["isNewIndex", function (cb1, results) { //if we here then create new index
            if (!results.isNewIndex) {
                cb1();
                return;
            }

            //define options for index @see https://gist.github.com/karmi/988923
            var options = {
                settings: {
                    index: {
                        index: NAMES.INDEX,
                        type: NAMES.TYPE,
                        analysis: {
                            analyzer: {
                                book_index_analyzer: {
                                    type: "custom",
                                    tokenizer: "standard",
                                    filter: ["standard", "lowercase", "book_i"]
                                },
                                book_search_analyzer: {
                                    type: "custom",
                                    tokenizer: "standard",
                                    filter: ["standard", "lowercase"]
                                }
                            },
                            filter: {
                                book_i: {
                                    type: "nGram",
                                    min_gram: 2,
                                    max_gram: 10
                                }
                            }
                        }
                    }
                },
                mappings: {
                    document: {
                        type: "object",
                        index_analyzer: "book_index_analyzer",
                        search_analyzer: "book_search_analyzer"
                    }
                }

            };

            self.elasticSearchClient.createCall(
                {data: JSON.stringify(options), path: "/" + NAMES.INDEX, method: "PUT"},
                self.elasticSearchClient.clientOptions
            )
                .on("data", function (data) {
                    var result = JSON.parse(data);
                    cb1(result.error);
                })
                .on("error", cb1)
                .exec();
        }]
    }, cb);
};

exports.Search = new Search();
