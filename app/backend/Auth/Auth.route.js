module.exports = function (app) {
    var router = app.get('router')();
    var async = app.get('async');
    var request = app.get('request');

    var AuthLogic = app.get('AuthLogic');

    var User = app.get('models').User;

    var config = app.get('config');

    router.post('/google', function (req, res) {
        var accessToken, profile;

        async.waterfall([
            function (callback) {
                //Setup parameters for the request
                var params = {
                    code: req.body.code,
                    client_id: req.body.clientId,
                    client_secret: config.google.clientSecret,
                    redirect_uri: req.body.redirectUri,
                    grant_type: 'authorization_code'
                };

                //Request URL
                var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';

                //Make the request
                return request.post(accessTokenUrl, {json: true, form: params}, function (err, response, token) {
                    if (err) return callback(err);

                    return callback(null, response, token);
                });
            },
            function (response, token, callback) {
                //Setup the token and the headers
                accessToken = token.access_token;
                var headers = {Authorization: 'Bearer ' + accessToken};

                //Request URL for Google Plus
                var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

                //Get the Google Plus account
                return request.get({url: peopleApiUrl, headers: headers, json: true}, function (err, response, p) {
                    if (err) return callback(err);
                    profile = p;
                    return callback(null);
                });
            },
            function (callback) {
                //Find all users
                return User
                    .find({email: profile.email})
                    .populate('companies')
                    .exec(callback);
            },
            function (users, callback) {
                if (users.length > 1) return callback({status: 422, message: 'Malformed users array'});

                //Create a new account if there aren't any users
                if (users.length < 1) {
                    var u = new User(profile);
                    u.accessToken = accessToken;

                    return u.save(callback);
                }

                return callback(null, users[0]);
            },
            function (u, callback) {
                //Generate a token
                return AuthLogic.genToken(u, callback);
            }
        ], function (err, result) {
            if (err) {
                console.error(err);
                return res.status(err.status || 400).send({
                    status: err.status || 400,
                    message: err.message
                });
            }

            return res.send(result);
        });
    });

    return router;
};