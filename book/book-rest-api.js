var BookProvider = require('./book-data-provider.js').BookProvider;
var Search = require('./book-search.js').Search;

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
    bookProvider = new BookProvider();
    searchProvider = new Search();

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
        if (!req.body) {
            res.send(500, "Wrong format - maybe malformed json?");
            return;
        }

        bookProvider.save(req.body, function (error, bookSaved) {
            if (error) {
                console.log('Error saving book. Mongodb: ' + error);
                res.send(500, 'Error saving book!');
            } else {
                searchProvider.index('book', 'document', elasticSearch(bookSaved), bookSaved._id.toHexString(), null, function (data) {
                    console.info(JSON.stringify(data));
                });
                res.send(JSON.stringify(bookSaved));
            }
        })
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
            console.log('Should not send empty queries. Correct client.')
            res.send("[]");
        }
        var qryObj = {
            "query": {
                "query_string": {
                    "query": req.query.q
                }
            }
        };
        searchProvider.search('book', 'document', qryObj, null, function (data) {
            var elasticResponse = JSON.parse(data);
            if (elasticResponse.error) {
                console.log('Error from Bonsai: ' + data);
                res.send(500, "Error from Bonsai");
                return;
            }
            var hits = elasticResponse.hits.hits;
            console.log(hits.length + " hits found for query " + req.query.id);

            var ids = hits.map(function (hit) {
                return hit._source.id;
            });
            bookProvider.findByIds(ids, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, "Error searching for books.");
                    return;
                }
                res.send(data)
            });

        });
    };

    this.update = function (req, res) {
        bookProvider.update(req.body, function (err, data) {
            if (err) {
                res.send(500, 'Error saving book!');
            }
            else {
                searchProvider.update('book', 'document', data._id, elasticSearch(data), function (d) {
                    console.info(JSON.stringify(d));
                });
                res.send(data);
            }
        });
    };

    var elasticSearch = function (book) {
        return {
            "name": book.name,
            "text": [book.Text, book.Title, book.Author, book.Tags.join(" ")].join(" "),
            "id": book._id
        }
    };
}

exports.BookRestApi = BookRestApi;