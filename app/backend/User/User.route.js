module.exports = function (app) {
    var router = app.get('router')();
    var Model = app.get('models').User;
    var auth = app.get('auth');
    var endpoint = app.get('endpoint');

    router.get('/:id?', auth, endpoint.read(Model, Model.populates));
    router.post('/:id', auth, endpoint.update(Model, Model.populates));
    router.delete('/:id', auth, endpoint.delete(Model));

    return router;
};