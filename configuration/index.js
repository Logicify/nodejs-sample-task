/**
 *  dependencies
 */
var _ = require('underscore');

/**
 * get environment for current application
 *
 * @param [env = 'dev']
 */
function _getEnvironment(env){
    var environments = ['prod','dev','test'];
    var defaultEnv = 'dev';

    if(typeof env === 'undefined' || !env){
        env = defaultEnv;
    }

    var currentEnv = process.env.NODE_ENV || env;

    //try to recognize what we have at the moment
    var possibleEnv = _.find(environments, function(env){
        return currentEnv.indexOf(env) != -1;
    });

    return possibleEnv || defaultEnv;
}

/**
 * return full configuration Object
 *
 * @param {String} env
 * @returns {*}
 */
function getConfiguration(env){
    var currentEnv = _getEnvironment(env);
    return require(['./', currentEnv].join(''));
}

/**
 * return configuration Object for mongo
 *
 * @param env
 * @returns {*}
 */
function getMongoConfiguration(env){
    return getConfiguration(env).mongo;
}

/**
 * return configuration Object for elastic
 *
 * @param env
 * @returns {*}
 */
function getElasticConfiguration(env){
    return getConfiguration(env).elastic;
}

/**
 * return configuration Object for log
 *
 * @param env
 * @returns {*}
 */
function getLogConfiguration(env){
    return getConfiguration(env).log;
}

module.exports = {
    getConfiguration: getConfiguration,
    getMongoConfiguration: getMongoConfiguration,
    getElasticConfiguration: getElasticConfiguration,
    getLogConfiguration: getLogConfiguration
};
