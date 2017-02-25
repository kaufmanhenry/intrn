module.exports = function (app) {
    var router = app.get('router')();

    var config = app.get('config');

    var models = app.get('models');
    var Model = models.Company;
    var Job = models.Job;

    var auth = app.get('auth');
    var endpoint = app.get('endpoint');

    router.get('/:id?', auth, endpoint.read(Model, Model.populates));
    router.post('/', auth, endpoint.create(Model, Model.populates, function (newCo, callback) {
        if (config.accessCodes.indexOf(newCo.accessCode) > -1) {
            return callback(null, newCo);
        }

        return callback({status: 400, message: 'Access codes do not match'});
    }));
    router.post('/:id', auth, endpoint.update(Model, Model.populates));
    router.delete('/:id', auth, endpoint.delete(Model));

    router.get('/:company/jobs', auth, endpoint.readChildren(Job, 'company', Job.populates));

    return router;
};