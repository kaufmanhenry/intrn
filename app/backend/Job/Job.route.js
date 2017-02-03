module.exports = function (app) {
    var router = app.get('router')();

    var models = app.get('models');
    var Model = models.Job;
    var Applicant = models.Applicant;

    var auth = app.get('auth');
    var endpoint = app.get('endpoint');

    router.get('/:id?', endpoint.read(Model, Model.populates));
    router.post('/', auth, endpoint.create(Model, Model.populates));
    router.post('/:id', auth, endpoint.update(Model, Model.populates));
    router.delete('/:id', auth, endpoint.delete(Model));

    router.get('/:job/applicants', auth, endpoint.readChildren(Applicant, 'job', Applicant.populates));

    return router;
};