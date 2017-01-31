module.exports = function (app) {
    var AuthLogic = require('./Auth.logic')(app);

    return function (req, res, next) {
        var token = req.headers.token;

        //Quick return if there is not a token
        if (!token) return res.sendStatus(403);

        //Verify the token submitted
        AuthLogic.verifyToken(token, function (err, user) {
            if (err) {
                console.error(err);
                return res.sendStatus(err.status || 400);
            }

            if (user) {
                return next();
            }

            return res.sendStatus(403);
        });
    };
};