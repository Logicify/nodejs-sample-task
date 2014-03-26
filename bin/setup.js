#! /usr/bin/env node

var bookProvider = require("../book/book-data-provider").BookProvider,
    Search = require("../book/book-search").Search,
    async = require("async"),
    _ = require("underscore"),
    user = require("readline").createInterface({input: process.stdin, output: process.stdout}),
    LOG = require("../lib/log"),
    sampleData = require("../mongodb/mongo-sample-data"),
    util = require("util");

/**
 * put all book into the elasticsearch
 * @param {Object} book Book to store
 * @param {Function} cb Callback function
 */
function createIndexesInSearch(cb) {
    async.waterfall([
        bookProvider.findAll.bind(bookProvider),
        function (books, cb1) {
            async.each(
                books,
                Search.index.bind(Search),
                cb1);
        }
    ], cb);
}

/**
 * It performs new data inserting
 */
function setup(cb) {
    async.series([

        //check mongo connection
        bookProvider.init.bind(bookProvider),

        //elastic has already connected

        //clear elastic indexes
        Search.dropAll.bind(Search),

        //add mongo data
        async.apply(async.each, sampleData, bookProvider.save.bind(bookProvider)),

        //add elastic indexes from all data in the store
        createIndexesInSearch

    ], function (err) {
        if (!err) {
            LOG("setup has run successfully");
        } else {
            var errorMessage = "some undefined error occurs";
            if (_.isObject(err) && err instanceof Error) {
                errorMessage = err.message;
            } else if (_.isString(err)) {
                errorMessage = err;
            }
            LOG("Can't complete setup, due to: " + errorMessage);
        }
        cb();
    });
}

/**
 * Here we have putted together all our stuff
 */
async.series([

    //try to connect to elastic
    Search.init.bind(Search),

    //setup new index
    Search.setupIndex.bind(Search),

    function(cb){
        user.question("Do you need to setup test data[yes/no]?", function (answer) {
            var _answer = answer.toLowerCase();
            if (_answer === "y" || _answer === "yes") {
                setup(cb);
            } else {
                cb();
            }
        });
    }
], function (err) {
    if(err){
        console.log(util.format("An error occurs: %j", err));
    }
    process.exit();
});
