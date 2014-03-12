/**
 * all book validation schemas here
 */
var _ = require('underscore');

var bookModel = {
    _id: {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{24}$"
    },
    "Title": {
        "type": "string",
        "maxLength": 100,
        "required": true
    },
    "Text": {
        "type": "string",
        "maxLength": 1024
    },
    "Author": {
        "type": "string",
        "maxLength": 100,
        "required": true
    },
    "Tags": {
        "type": "array",
        "items": {
            "type": "string",
            "maxLength": 100
        }
    }
};

var _getBookModel = function(){
    return _.clone(bookModel);
};

var _getUpdateBookModel = function () {
    var result = _getBookModel();
    _.each(result, function(item){
        delete item.required;
    });
    return result;
};

module.exports = {
    findAllBooks: {
        "$schema": "http://json-schema.org/draft-03/schema#",
        "name": "findAllBooks",
        "properties": {
        },
        "additionalProperties": false
    },
    newBook: {
        "$schema": "http://json-schema.org/draft-03/schema#",
        "name": "newBook",
        "properties": _.omit(_getBookModel(), "_id"),
        "additionalProperties": false
    },
    searchForBooks: {
        "$schema": "http://json-schema.org/draft-03/schema#",
        "name": "searchForBooks",
        "properties": {
            "q": {
                "type": "string",
                "maxLength": 1024
            }
        },
        "additionalProperties": false
    },
    update: {
        "$schema": "http://json-schema.org/draft-03/schema#",
        "name": "update",
        "properties": _getUpdateBookModel(),
        "additionalProperties": false
    }
};
