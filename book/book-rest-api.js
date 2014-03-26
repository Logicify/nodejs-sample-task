/**
 * dependencies
 */
var BookProvider = require('./book-data-provider.js').BookProvider,
    Search = require('./book-search.js').Search,
    LOG = require('../lib/log.js'),
    async = require("async");

/**
 * An object providing rest api for books.
 *
 * Made it not via prototypes, rather via direct construction, to make the routing code of server.js more clear.
 * Anyway such endpoints are going to be sealed (final) so no extension is thought of at the moment.
 *
 * @constructor default
 *
 */
function BookRestApi() {
    var bookProvider = BookProvider;
    var searchProvider = Search;
    var self = this;

    /**
     * Retuns all the books from the storage. Should be used with care. Apply paging later?
     * @param req express request
     * @param res express response
     */
    this.findAllBooks = function (req, res) {
        bookProvider.findAll(function (error, data) {
            if (error) {
                res.send(JSON.stringify({"error": error}))
            } else {
                res.send(JSON.stringify(data));
            }
        });
    };

    /**
     * Creates a new book from the clients' JSON. Updates both the MongoDB and the search index.
     *
     * @param req express request
     * @param res express response
     */
    this.newBook = function (req, res) {

        async.waterfall([
            async.apply(bookProvider.save.bind(bookProvider), req.body),
            searchProvider.index.bind(searchProvider)
        ], function (err, data) {
            if (err) {
                LOG('Error saving book: ' + err);
                res.send(500, 'Error saving book!');
                return;
            }
            var message = JSON.stringify(data);
            LOG(message);
            res.send(message);
        });
    };


    /**
     * Search for books endpoint. Waits for 'q' parameter with the keywords to search against, separated by comma. Like
     * ?q=madam,1,none,starting
     *
     * @param req express request
     * @param res express response
     */
    this.searchForBooks = function (req, res) {
        if (!req.query.q) {
            self.findAllBooks(req, res);
            return;
        }

        async.waterfall([
            async.apply(searchProvider.search.bind(searchProvider), req.query.q, null),
            function (data, cb) {
                var elasticResponse = JSON.parse(data);
                if (elasticResponse.error) {
                    LOG('Error from Bonsai: ' + data);
                    res.send(500, "Error from Bonsai");
                    return;
                }
                var hits = elasticResponse.hits.hits;
                LOG(hits.length + " hits found for query " + req.query.id);

                var ids = hits.map(function (hit) {
                    return hit._source.id;
                });
                async.nextTick(function () {
                    cb(null, ids);
                });
            },
            bookProvider.findByIds.bind(bookProvider)
        ], function (err, data) {
            if (err) {
                LOG(err);
                res.send(500, "Error searching for books.");
                return;
            }
            res.send(data);
        });
    };

    this.update = function (req, res) {

        async.auto({
            "inMongo": async.apply(bookProvider.update.bind(bookProvider), req.body),
            "inSearch": ["inMongo", function (cb, results) {
                searchProvider.update(results.inMongo, cb);
            }]
        }, function (err, results) {
            if (err) {
                res.send(500, 'Error saving book!');
                return;
            }
            LOG(JSON.stringify(results.inSearch));
            res.send(results.inMongo);
        });
    };
}

exports.BookRestApi = BookRestApi;
