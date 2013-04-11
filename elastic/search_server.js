var ElasticSearchClient = require('elasticsearchclient'),
    url = require('url');


var serverOptions = {
    host: "10.10.1.4",
    port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

elasticSearchClient.index('sample', 'document', {'name': 'Reliability', 'text': 'Reliability is improved if multiple ' +
    'redundant sites are used, which makes well-designed cloud computing suitable for business continuity and disaster recovery. ', id: "1"})
    .on('data', function (data) {
        console.log(data)
    })
    .exec();

var qryObj = {
    "query": {
        "query_string": {
            "query": "Reliability"
        }
    }
};

elasticSearchClient.search('sample', 'document', qryObj)
    .on('data',function (data) {
        console.log(data)
    }).on('error', function (error) {
        console.log(error)
    })
    .exec();
