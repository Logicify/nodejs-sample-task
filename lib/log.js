var config = require('../configuration').getLogConfiguration();

/**
 * Making a log sink which can be disabled easily.
 */
function log() {
    if(config.enabled){
        console.log.apply(console, arguments);
    }
}

module.exports = log;
