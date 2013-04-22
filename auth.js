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

var RESPONSE_500 = {
    responseCode: 500,
    status: {
        errorCode: 500,
        errorMessage: 'Internal Server Error'
    }
};


/**
 * Middleware entry point.
 * Perform access check.
 *
 * @type {Function}
 */
module.exports = function (options) {
    var loginUrl = options.loginUrl;
    var logoutUrl = options.logoutUrl;
    var excludeUrls = options.excludeUrls;

    return function (req, res, next) {
        var path = req.path;

        //exclude urls filtering
        for (var i = 0; i < excludeUrls.length; i++) {
            if (new RegExp(excludeUrls[i], "g").test(path)) {
                //authorisation not required
                //process next in chain
                next();
                return;
            }
        }

        //login url filtering
        if (path === loginUrl) {
            if (doLogin(req, res)) {
                //successful auth check,
                //end life-circle and allow next request (authorised)
                console.warn(
                    new Date().toLocaleTimeString() +
                        util.format(" SID=%s", req.sessionID) +
                        util.format(" Login success for user %s", getSessionUserId(req))
                );
                return;
            } else {
                //cannot login
                console.error(
                    new Date().toLocaleTimeString() +
                        util.format(" SID=%s", req.sessionID) +
                        util.format(" Login failed for user %s", null)
                );
                return;
            }
        }

        //logout url filtering
        if (path === logoutUrl) {
            if (doLogout(req, res)) {
                //successful logout
                //end life-circle and allow next request (unauthorised)
                console.warn(
                    new Date().toLocaleTimeString() +
                        util.format(" SID=%s", req.sessionID) +
                        util.format(" Logout success, session destroyed")
                );
                return;
            } else {
                //has no authenticated session
                return;
            }
        }


        //common processing
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
function doLogin(req, res) {
    //already authenticated
    if (getSessionUserId(req) != null) {
        res.status(RESPONSE_200.responseCode);
        res.json(RESPONSE_200.status);
        return true;
    }

    //parameter missing
    if (!req.body.username || !req.body.password) {
        res.status(RESPONSE_400.responseCode);
        res.json(RESPONSE_400.status);
        return false;
    }

    //validate login credentials
    var user = findUserByNameAndPassword(req.body.username, req.body.password);
    if (user == null) {
        res.status(RESPONSE_403.responseCode);
        res.json(RESPONSE_403.status);
        return false;
    }

    setSessionUserId(req, user.userId);

    res.status(RESPONSE_200.responseCode);
    res.json(RESPONSE_200.status);
    return true;
}

function doLogout(req, res) {
    if (!getSessionUserId(req)) {
        res.status(RESPONSE_200.responseCode);
        res.json(RESPONSE_200.status);

        return false;
    }

    var returnFlag = true;
    req.session.destroy(function (err) {
        if (err != null) {
            //cannot destroy session doe to
            //some internal error
            res.status(RESPONSE_500.responseCode);
            res.json(RESPONSE_500.status);
            console.error(
                new Date().toLocaleTimeString() +
                    util.format(" SID=%s", req.sessionID) +
                    util.format(" Cannot destroy session due to internal error\n>> %s", err)
            );
            returnFlag = false;
        } else {
            res.status(RESPONSE_200.responseCode);
            res.json(RESPONSE_200.status);
        }
    });

    return returnFlag;
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

/**
 * Find user by username and password.
 *
 * @param username
 * @param password
 * @returns user instance if exist, null otherwise
 */
function findUserByNameAndPassword(username, password) {
    //TODO add DB logic
    if ("admin" != username || "password" != password) {
        return null;
    }

    return {userId: 1};
}

