module.exports = function (app) {
    var jwt = app.get('jwt');
    var config = app.get('config');
    var User = app.get('models').User;

    var genToken = function (user, callback) {
        return jwt.sign({user: user._id}, config.secret, {}, callback);
    };

    var verifyToken = function (token, callback) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return (err);

            if (decoded.user) {
                return User.findOne({_id: decoded.user}, function (err, user) {
                    if (err) return callback(err);

                    if (!user) return callback({message: 'User does not exist.', status: 403});

                    return callback(null, user);
                });
            }

            return callback(null, decoded);
        });
    };

    return {
        genToken: genToken,
        verifyToken: verifyToken
    };
};