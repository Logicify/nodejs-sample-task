/**
 * dependencies
 */

var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID,
    LOG = require('../lib/log.js'),
    config = require("./../config.json");


/**
 * Data provier for books (mongo).
 * It takes configuration either from config.json or the env variable of mongolab given
 * by heroku.
 *
 * @constructor
 */
BookProvider = function () {
};

/**
 * create connection to database
 *
 * $this {BookProvider}
 * @param {Function} cb Callback function
 */
BookProvider.prototype.init = function (cb) {
    //TODO: generify it to support other data providers.
    var username;
    var password;

    var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
    if (mongoUri) {
        // parsing mongoLab, if any
        var match = /mongodb:\/\/(\w+):(\w+)@([\w\.]+):(\d+)\/(\w+)/g.exec(mongoUri);
        username = match[1];
        password = match[2];
        config.mongoHost = match[3];
        config.mongoPort = parseInt(match[4]);
        config.mongoDbName = match[5];
        LOG("Parsed configs. Using connection string provided by mongolab.")
    }
    this.db = new Db(config.mongoDbName, new Server(config.mongoHost, config.mongoPort, {auto_reconnect: true}), {safe: true});
    this.db.open(function (err, db) {
        if (err) {
            cb(err);
            return;
        }

        LOG("Connected to DB successfully");
        if(!username){
            cb();
            return;
        }

        LOG('About to perform authentication.');
        db.authenticate(username, password, cb);
    });
};

/**
 * select `book` collection
 *
 * @this {BookProvider}
 * @param {Function} callback Callback function
 */
BookProvider.prototype.getCollection = function (callback) {
    this.db.collection('books', function (error, collection) {
        if (error) callback(error);
        else callback(null, collection);
    });
};

BookProvider.prototype.findAll = function (callback) {
    this.getCollection(function (error, article) {
        if (error) callback(error)
        else {
            article.find().toArray(function (error, results) {
                if (error) callback(error)
                else callback(null, results)
            });
        }
    });
};

/**
 * save book into the database
 *
 * @this {BookProvider}
 * @param {bookModel} book Book object to save in the database
 * @param callback
 */
BookProvider.prototype.save = function (book, callback) {
    this.getCollection(function (error, collection) {
        if (error) {
            callback(error);
        } else {
            book.inserted_at = new Date();

            if (!book.Tags) {
                book.Tags = [];
            }
            for (var j = 0; j < book.Tags.length; j++) {
                book.Tags[j].inserted_at = new Date();
            }
            collection.insert(book, function () {
                callback(null, book);
            });
        }
    });
};


/**
 * find Array of book objects by specified Array of id
 *
 * @this {BookProvider}
 * @param {Array.<ObjectID>} ids Array of id to look for
 * @param {Function} callback Callback function
 */
BookProvider.prototype.findByIds = function (ids, callback) {
    this.getCollection(function (error, collection) {
        if (error) {
            callback(error);
        } else {
            var objectIds = ids.map(function (id) {
                return ObjectID.createFromHexString(id);
            });
            var mongoDbQuery = {
                _id: {
                    $in: objectIds
                }
            };
            collection.find(mongoDbQuery).toArray(function (err, docs) {
                callback(err, docs);
            });
        }
    })
};


/**
 * update book in the database
 *
 * @this {BookProvider}
 * @param {bookModel} bookUpdate Book object to update
 * @param {Function} callback Callback function
 */
BookProvider.prototype.update = function (bookUpdate, callback) {
    this.getCollection(function (error, collection) {
        if (error) {
            callback(error)
        }
        else {
            var id = bookUpdate._id;
            delete bookUpdate._id;

            collection.findAndModify(
                {_id: ObjectID.createFromHexString(id)},
                [],
                {$set: bookUpdate},
                {new: true},
                function (err, updated) {
                    if (err) {
                        LOG("Book not updated.");
                        callback(err);
                    }
                    else {
                        callback(err, updated);
                    }
                });
        }
    });
};

exports.BookProvider = new BookProvider();
