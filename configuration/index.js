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
 * @param {String} [env = 'dev']
 * @returns {*}
 */
function getConfiguration(env){
    var currentEnv = _getEnvironment(env);
    return require(['./', currentEnv].join(''));
}

/**
 * return configuration Object for mongo
 *
 * @param {String} env [env = 'dev']
 * @returns {*}
 */
function getMongoConfiguration(env){
    return getConfiguration(env).mongo;
}

/**
 * return configuration Object for elastic
 *
 * @param {String} [env = 'dev']
 * @returns {*}
 */
function getElasticConfiguration(env){
    return getConfiguration(env).elastic;
}

/**
 * return configuration Object for log
 *
 * @param {String} [env = 'dev']
 * @returns {*}
 */
function getLogConfiguration(env){
    return getConfiguration(env).log;
}

/**
 * return configuration Object for session store
 *
 * @param {String} [env = 'dev']
 * @returns {*}
 */
function getStoreConfig(env){
    var mongoConfig = getMongoConfiguration(env);
    return _.extend({}, mongoConfig, {db: mongoConfig.dbName});
}

module.exports = {
    getConfiguration: getConfiguration,
    getMongoConfiguration: getMongoConfiguration,
    getElasticConfiguration: getElasticConfiguration,
    getLogConfiguration: getLogConfiguration,
    getStoreConfig: getStoreConfig
};
