module.exports = function (app) {
    var router = app.get('router')();

    var async = app.get('async');

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

    //Endpoint to add an interest for a job
    router.post('/:job/addInterest', function (req, res) {
        async.waterfall([
            function (callback) {
                //Find a job
                Model.findOne({
                    _id: req.params.job
                }, callback);
            },
            function (job, callback) {
                //If no job exists, return with an error
                if (!job) return callback({status: 404, message: 'No job found'});

                //Update the job interests
                job.interest++;

                //Save the job
                return job.save(callback)
            }
        ], function (err, result) {
            if (err) return res.status(err.status || 400).send({
                status: err.status || 400,
                message: err.message || 'Bad request'
            });

            return res.send(result);
        });
    });

    return router;
};