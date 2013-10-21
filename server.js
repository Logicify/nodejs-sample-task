var Application = require('./app'),
    appInstance = new Application();

appInstance.init(function (err) {
    appInstance.bindServer();
});
