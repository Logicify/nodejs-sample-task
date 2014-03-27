
var defaultPort = 3000;

var configuration = {
    port: process.env.PORT || defaultPort,
    mongo: {
        dbName: "nodejs-mongo-sample-test",
        host: "localhost",
        port: 27017
    },
    elastic: {
        host: "localhost",
        port: 9200
    },
    log: {
        enabled: false
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
