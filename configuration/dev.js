//this is the default configuration

var defaultPort = 3000;

var configuration = {
    port: process.env.PORT || defaultPort,
    mongo: {
        dbName: "nodejs-mongo-sample",
        host: "localhost",
        port: 27017
    },
    elastic: {
        host: "localhost",
        port: 9200
    },
    log: {
        enabled: true
    },
    session: {
        secret: 'so very secret',
        key: 'logicify.sample',
        cookie: {maxAge: 3600000}
    },
    cookieParser: {
        secret: 'shhhh, very secret'
    }
};

module.exports = configuration;
