/**
 * index page generator
 *
 * @param req
 * @param res
 */
function index(req, res){
    res.render('index', {
        title: 'Welcome page'
    })
}

/**
 * secret page generator
 *
 * @param req
 * @param res
 */
function secret(req, res){
    res.render('secret', {
        title: 'Logicify: Node, Ext, Mongo and ElasticSearch sample application'
    });
}

function _404(req, res){
    res.render('404', {
        title: '404 page not found'
    });
}

exports.static = function(app){
    app.get('^/$', index);
    app.get('/index.html', index);
    app.get('/secret.html', secret);
};

exports.route404 = _404;