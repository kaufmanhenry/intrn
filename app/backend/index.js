module.exports = function (app, callback) {
    var router = app.get('router')();

    //Database
    var db = app.appRequire('dbProvider', './backend/db')(app);
    app.set('db', db);

    //Enums
    var enums = app.appRequire('enumsProvider', './backend/Enums/index')(app);
    app.set('enums', enums);

    //Model creator
    var models = app.appRequire('modelsProvider', './backend/models')(app);
    app.set('models', models);

    //Main endpoint
    var endpoint = app.appRequire('endpointProvider', './backend/endpoint')(app);
    app.set('endpoint', endpoint);

    //Create models
    models.createModel(require('./User/User.model')(app));
    models.createModel(require('./Company/Company.model')(app));
    models.createModel(require('./Job/Job.model')(app));
    models.createModel(require('./Applicant/Applicant.model')(app));

    //Auth logic
    var AuthLogic = app.appRequire('AuthLogicProvider', './backend/Auth/Auth.logic')(app);
    app.set('AuthLogic', AuthLogic);

    //Auth middleware
    var AuthMiddleware = app.appRequire('AuthMiddlewareProvider', './backend/Auth/Auth.middleware')(app);
    app.set('auth', AuthMiddleware);

    //Create routes
    models.allRaw.forEach(function(model) {
        console.info('Creating route for ' + model.name + ' at ' + model.path);
        router.use(model.path, model.route(app));
    });

    //Other routes
    router.use('/auth', require('./Auth/Auth.route')(app));
    router.use('/enums', require('./Enums/Enums.route')(app));

    return callback(null, router);
};