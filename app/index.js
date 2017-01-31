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

app.appRequire = appRequire;

var bodyParser = appRequire('body-parser');

appRequire('async');
appRequire('bcrypt');
appRequire('jwt', 'jsonwebtoken');
appRequire('mongoose');
appRequire('mongoose');
appRequire('passport');
appRequire('extend');
appRequire('request');
appRequire('passport-google-oauth');
appRequire('session', 'express-session');

var config = appRequire('config', './config');

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