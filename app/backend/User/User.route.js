module.exports = function (app) {
    var router = app.get('router')();
    var models = app.get('models');
    var Model = models.User;
    var Company = models.Company;
    var auth = app.get('auth');
    var endpoint = app.get('endpoint');

    router.get('/:id?', auth, endpoint.read(Model, Model.populates));
    router.post('/:id', auth, endpoint.update(Model, Model.populates));
    router.delete('/:id', auth, endpoint.delete(Model));

    router.get('/:users/companies', auth, endpoint.readChildren(Company, 'users', Company.populates));

    return router;
};