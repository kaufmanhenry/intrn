module.exports = function (app) {

    var router = app.get('router')();

    var auth = app.get('auth');
    var config = app.get('config');

    var mongoose = app.get('mongoose');

    var db = app.get('db');
    var conn = db.conn;

    var models = app.get('models');
    var User = models.User;

    var enums = app.get('enums');

    var BLOB_ROUTE = '/api/blobs/'; //todo dynamically load from express variables
    var BLOB_ROUTE_SUFFIX = '/blob';

    var AuthLogic = app.get('AuthLogic');

    //Configuration for blob storage (See Blob backend component)
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);

    var multer = require('multer');

    var storage = require('multer-gridfs-storage')({
        gfs: gfs,
        filename: function (req, file, cb) {
            if (typeof req.body.filename !== 'string') return cb({message: 'Filename is required', status: 422});
            return cb(null, req.body.filename);
        },
        metadata: function (req, file, cb) {
            if (typeof req.body.user !== 'string') return cb({message: 'User is required', status: 422});
            AuthLogic.verifyToken(req.headers.token, function (err, token) {
                if (err) return cb(err);

                if (token._id.toString() !== (req.body.user._id||req.body.user)) {
                    return cb({
                        message: 'Authentication error. File owner does not match token.',
                        status: 403
                    });
                }

                return User.find({
                    _id: req.body.user
                }, function (err, results) {
                    if (err) {
                        console.error(err);
                        return cb(err);
                    }

                    if (results.length === 1) {
                        Object.keys(req.body).forEach(function (key) {
                            var val = req.body[key];
                            try {
                                val = JSON.parse(val);
                            } catch (e) {
                                // console.log(e);
                            } finally {
                                req.body[key] = val;
                            }
                        });

                        return cb(null, req.body);
                    }

                    return cb({message: 'Single user not found', usersFound: results, status: 422});
                });

            });
        }
    });
    var upload = multer({storage: storage});


    function transformGFSFileToBlob(result) {
        console.log(result)
        return {
            file: result,
            _id: result._id||result.id,
            path: BLOB_ROUTE + (result._id||result.id) + BLOB_ROUTE_SUFFIX
        };
    }

    function queryBlobs(req, res, query) {
        gfs.files.find(query).toArray(function (err, results) {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            return res.send(results.map(transformGFSFileToBlob));
        });
    }


    router.get('/', auth, function (req, res) {
        return queryBlobs(req, res, {});
    });

    router.get('/jobs/:job', auth, function (req, res) {
        return queryBlobs(req, res, {'metadata.job': req.params.job});
    });

    router.get('/:_id', auth, function (req, res) {
        gfs.files.findOne({
            _id: req.params._id
        }, function (err, result) {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            if (result) {
                return res.send(transformGFSFileToBlob(result));
            } else {
                return res.sendStatus(404);
            }
        });
    });

    //No security on actual blob
    function readRoute(req, res) {
        gfs.findOne({
            _id: req.params._id
        }, function (err, result) {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            if (result) {
                res.set('Content-Type', result.contentType);
                res.set('Content-Disposition', 'filename="' + result.filename + '"');
                var readStream = gfs.createReadStream({
                    _id: req.params._id
                });
                readStream.pipe(res);
                readStream.on('error', function (err) {
                    console.error('GFS Error', err);
                    res.sendStatus(400);
                });
            } else {
                return res.sendStatus(404);
            }
        });
    }

    router.get('/:_id/blob', readRoute);
    router.get('/users/:user/:_id/blob', readRoute);

    router.post('/',
        function (req, res, next) {
            return upload.single('file')(req, res, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(err.status || 500).send(err);
                }

                return next();
            });
        },
        function (req, res) {
            return res.send(transformGFSFileToBlob(req.file));
        });

    function deleteRoute(req, res) {
        gfs.remove({
            _id: req.params._id,
            'metadata.user': req.params.id
        }, function (err) {
            if (err) {
                console.error(err);
                return res.sendStatus(400);
            }
            res.sendStatus(204);
        });
    }

    router.delete('/:_id', auth, deleteRoute);

    router.delete('/users/:user/blobs/:_id', auth, deleteRoute);

    return router;
};