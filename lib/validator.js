/**
 * dependencies
 */
var _ = require('underscore'),
    validate = require('json-schema').validate,
    LOG = require('./log'),
    util = require("util");

/**
 * create validation middleware according to schema specified
 *
 * @param {Object} schema Json-schema to validate input fields
 * @returns {Function}
 */
exports.getMiddleware = function(schema){

    return function(req, res, next){

        //prepare data
        var objectToValidate = _.extend({}, req.body, req.query, req.params);

        //validate
        var result =  validate(objectToValidate, schema);

        //respond appropriate
        if (result.valid) {
            next();
        } else {
            //error
            LOG(util.format("Error: validation failed for: %s \n with errors: %j",schema.name, result.errors));
            res.send(400, "validation error");
        }
    }
};
