//Require express, the web framework
var express = require('express');

//Declare app and set the router
var app = express();
app.set('router', express.Router);

//Create a shortcut method for requiring dependencies
var appRequire = function (name, requireName) {
    var dep = require(requireName || name);
    app.set(name, dep);
    return dep;
};

var bodyParser;
try {
//Require necessary dependencies
    appRequire('jwt', 'jsonwebtoken');
    appRequire('mongoose');
    appRequire('async');
    appRequire('bcrypt');
    appRequire('fs');
    appRequire('passport');

    bodyParser = appRequire('body-parser');
} catch (e) {
    console.error('Error loading critical dependencies.', e);
    console.info('Critical dependencies could not be loaded. Ensure that "npm install" has executed without error.');
    process.exit();
}

var config;
try {
    config = appRequire('config', './config');
} catch (e) {
    console.error('No config.local.js file present in /app.', e);
    console.info('You have not yet setup your config.local.js file. Make a copy of app/config.default.js and name it config.local.js. Tweak the settings and try launching CustomerPortal again.');
    process.exit();
}

//Middleware
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
//If the config allows cross origin requests, set that up
if (config.crossOrigin) {
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    });
}

//Use the appDirectory declared in the config file as the default folder for the frontend content
app.use(express.static(config.appDirectory));

//Require the main backend file
require('./backend/index')(app, function (err, router) {
    app.use('/api', router);
    app.listen(config.port);
    console.info('Intrn Running on Port ' + config.port);
});