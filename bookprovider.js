var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var config = require("./config.json");


console.log("Getting data provider configuration.");

BookProvider = function () {
    var username;
    var password;

    var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
    if (mongoUri) {
        // parsing mongoLab, if any
        var match = /mongodb:\/\/(\w+):(\w+)@([\w\.]+):(\d+)\/(\w+)/g.exec(mongoUri)
        username = match[1];
        password = match[2];
        config.mongoHost = match[3];
        config.mongoPort = parseInt(match[4]);
        config.mongoDbName = match[5];
        console.log("Parsed configs. Using connection string provided by mongolab.")
    }
    this.db = new Db(config.mongoDbName, new Server(config.mongoHost, config.mongoPort, {auto_reconnect: true}, {}));
    this.db.open(function () {
        console.log("Opened connection to DB")
    });
    if (username) {
        this.db.authenticate(username, password, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('Success!');
            }
        });
    }
};


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

BookProvider.prototype.save = function (book, callback) {
    this.getCollection(function (error, collection) {
        if (error) {
            callback(error);
        } else {
            book.inserted_at = new Date();
            if (book.tags === undefined) book.tags = [];
            for (var j = 0; j < book.tags.length; j++) {
                book.comments[j].inserted_at = new Date();
            }

            collection.insert(book, function () {
                callback(null, book);
            });
        }
    });
};

/*

 BookProvider.prototype.findById = function (id, callback) {
 this.getCollection(function (error, article_collection) {
 if (error) callback(error)
 else {
 article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function (error, result) {
 if (error) callback(error)
 else callback(null, result)
 });
 }
 });
 };

 */


exports.BookProvider = BookProvider;