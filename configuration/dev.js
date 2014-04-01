//this is the default configuration

var defaultPort = 3000;

var configuration = {
    port: process.env.PORT || defaultPort,
    host: 'localhost',
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
    },
    https: {
        port: 5000,
        key: 'certificates/https/server.key',
        cert: 'certificates/https/server.crt'
    },
    isHTTPS: function(req){
        return Boolean(req.secure);
    }
};

module.exports = configuration;
