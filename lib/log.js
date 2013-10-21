/**
 * Making a log sink which can be disabled easily.
 */
function log() {
    if (process.env.DISABLE_LOG) {
        return;
    }
    console.log.apply(console, arguments);
}

module.exports = log;