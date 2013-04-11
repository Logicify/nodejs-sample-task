var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


var config = require("./config.json");

console.log("Getting data provider configuration.");
console.log("DB name is " + config.mongoDbName);

BookProvider = function () {
    var c = config;
    this.db = new Db(config.mongoDbName, new Server(config.mongoHost, config.mongoPort, {auto_reconnect: true}, {}));
    this.db.open(function () {
        console.log("Opened connection to DB")
    });
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

 BookProvider.prototype.save = function (articles, callback) {
 this.getCollection(function (error, article_collection) {
 if (error) callback(error)
 else {
 if (typeof(articles.length) == "undefined")
 articles = [articles];

 for (var i = 0; i < articles.length; i++) {
 article = articles[i];
 article.created_at = new Date();
 if (article.comments === undefined) article.comments = [];
 for (var j = 0; j < article.comments.length; j++) {
 article.comments[j].created_at = new Date();
 }
 }

 article_collection.insert(articles, function () {
 callback(null, articles);
 });
 }
 });
 };
 */

exports.BookProvider = BookProvider;