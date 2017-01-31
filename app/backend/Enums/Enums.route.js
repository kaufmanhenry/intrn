module.exports = function (app) {
    var router = app.get('router')();

    var Enums = app.get('enums');

    Object.keys(Enums).forEach(function (key) {
        router.get('/' + key, function (req, res) {
            return res.send(Enums[key]);
        });
    });

    router.get('/', function (req, res) {
        return res.send(Enums);
    });

    return router;
};