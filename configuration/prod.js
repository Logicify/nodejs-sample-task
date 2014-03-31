/**
 * generate mongo parameters
 * @returns {{dbName: string, host: string, port: number, username: string, password: string}}
 * @private
 */
function _getMongoParameters() {
    var parameters = {
        dbName: "",
        host: "",
        port: null,
        username: "",
        password: ""
    };

    var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
    if (mongoUri) {
        // parsing mongoLab, if any
        var match = /mongodb:\/\/(\w+):(\w+)@([\w\.]+):(\d+)\/(\w+)/g.exec(mongoUri);
        parameters.username = match[1];
        parameters.password = match[2];
        parameters.host = match[3];
        parameters.port = parseInt(match[4]);
        parameters.dbName = match[5];
    }

    return parameters;
}

/**
 * prepare Elastic parameters
 * @returns {{host: string, port: number, auth: string}}
 * @private
 */
function _getElasticParameters() {
    var parameters = {
        host: "",
        port: null,
        auth: ""
    };

    var bonsaiHost = process.env.BONSAI_URL;
    if (bonsaiHost) {
        var match = /http:\/\/(\w+):(\w+)@(.+)/g.exec(bonsaiHost);

        parameters.auth = {
            username: match[1],
            password: match[2]
        };
        parameters.host = match[3];
        parameters.port = 80;
    }

    return parameters;
}

/**
 * prepare log parameters
 * @returns {{enabled: boolean}}
 * @private
 */
function _getLogParameters() {
    var parameters = {
        enabled: (process.env.DISABLE_LOG) ? false : true
    };

    return parameters;
}


var configuration = {
    port: process.env.PORT,
    mongo: _getMongoParameters(),
    elastic: _getElasticParameters(),
    log: _getLogParameters(),
    session: {
        secret: 'so very secret',
        key: 'logicify.sample',
        cookie: {maxAge: 3600000}
    },
    cookieParser: {
        secret: 'shhhh, very secret'
    },
    https: null  //no need to run secure server
};

module.exports = configuration;
