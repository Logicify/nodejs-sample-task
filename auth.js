/**
 * Auth middleware based on Redis session storage.
 *
 * User: Igor Cherednichenko
 * Date: 4/19/13
 * Time: 1:44 PM
 */

var util = require('util');

/**
 * Predefined responds
 */
var RESPONSE_200 = {
    responseCode: 200,
    status: {
        errorCode: 0,
        errorMessage: null
    }
};

var RESPONSE_400 = {
    responseCode: 400,
    status: {
        errorCode: 400,
        errorMessage: 'Bad Request'
    }
};

var RESPONSE_403 = {
    responseCode: 403,
    status: {
        errorCode: 403,
        errorMessage: 'Unauthorized access denied'
    }
};

/**
 * Middleware entry point.
 * Perform access check.
 *
 * @type {Function}
 */
module.exports = function (options) {
    //TODO provide excluded paths (without authorisation)
    //TODO provide callbacks for autenticate and authorise
    var loginUrl = options.loginUrl;

    return function (req, res, next) {
        if (req.path === loginUrl) {
            if (authenticate(req, res)) {
                //successful auth check,
                //end life-circle and allow next already authorised request
                //with data processing
                console.warn(
                    new Date().toLocaleTimeString() +
                    util.format(" SID=%s", req.sessionID) +
                    util.format(" Authentication success for user %s", getSessionUserId(req))
                );
                return;
            } else {
                //cannot authenticate
                console.error(
                    new Date().toLocaleTimeString() +
                        util.format(" SID=%s", req.sessionID) +
                        util.format(" Authentication failed for user %s", null)
                );
                return;
            }
        }

        if (checkAuthentication(req, res)) {
            //authentication passed successfully,
            //get authorisation data (ACL)
            checkAuthorization(req, res);
            //process next in chain
            next();
        } else {
            //unauthorized access
            console.error(
                new Date().toLocaleTimeString() +
                    util.format(" SID=%s", req.sessionID) +
                    util.format(" Unauthorized access to %s from %s", req.originalUrl, req.ip)
            );
        }
    }
}

/**
 * Check if user authenticated or not.
 * Authenticated user should has valid
 * session with specified userId.
 *
 * @param req
 * @param res
 * @return true, if session authenticated, false otherwise
 */
function checkAuthentication(req, res) {
    if (getSessionUserId(req) == null) {
        res.status(RESPONSE_403.responseCode);
        res.json(RESPONSE_403.status);
        return false;
    }

    return true;
}

/**
 * Authenticate user.
 *
 * @param req
 * @param res
 * @return true, if authentication pass, false otherwise
 */
function authenticate(req, res) {
    //already authenticated
    if (getSessionUserId(req) != null) {
        return true;
    }

    //parameter missing
    if (!req.body.username || !req.body.password) {
        res.status(RESPONSE_400.responseCode);
        res.json(RESPONSE_400.status);
        return false;
    }

    //validate login credentials
    //TODO provide correct validation logic
    if ("admin" != req.body.username || "password" != req.body.password) {
        res.status(RESPONSE_403.responseCode);
        res.json(RESPONSE_403.status);
        return false;
    }

    setSessionUserId(1);

    res.status(RESPONSE_200.responseCode);
    res.json(RESPONSE_200.status);
    return true;
}

/**
 * Check if user authorised or not.
 *
 * @param req
 * @param res
 * @return true, if session authenticated, false otherwise
 */
function checkAuthorization(req, res) {

}

/**
 * Return value of userId property
 * from session.
 *
 * @param req
 * @return userId string or null in not defined
 */
function getSessionUserId(req) {
    return req.session.userId;
}

/**
 * Set value of userId property
 * to session.
 *
 * @param req
 * @param userId
 */
function setSessionUserId(req, userId) {
    req.session.userId = userId;
}

