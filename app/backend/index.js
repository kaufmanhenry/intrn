module.exports = function (app, callback) {
    var router = app.get('router')();

    return callback(null, router);
};