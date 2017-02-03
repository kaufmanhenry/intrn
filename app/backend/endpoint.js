module.exports = function (app) {
    var async = app.get('async');

    /**
     * A no operation function to run if middleware is not present.
     * @param  {Object} a - An object to return with the function.
     * @param  {Function} callback - A function to run the callback on.
     * @return {Function} - A function that contains the data.
     */
    var noop = function (a, callback) {
        return callback(null, a);
    };

    /**
     * A no operation function to run if middleware is not present with an extra parameter.
     *
     * @param  {Object} a - An object to return with the function.
     * @param  {Object} b - An old object to return with the function.
     * @param  {Function} callback - A function to run the callback on.
     * @return {Function} - A function that contains the data.
     */
    var nooop = function (a, b, callback) {
        return callback(null, a);
    };

    var endpoint = {};

    /**
     * Reads data from a model.
     *
     * @param  {Object} Model - A model to read data from.
     * @param  {Array} populates - An array of populates for the object.
     * @param  {Function} queryMiddleware - Middleware to run  on the query.
     * @param  {Function} middleware - Middleware to run after running the operation.
     */
    endpoint.read = function (Model, populates, queryMiddleware, middleware) {
        if (!middleware) middleware = noop;

        return function (req, res) {
            async.waterfall([
                function (callback) {
                    // Build the query
                    var query = undefined;

                    // If there is a parameter of an ID in the URL, add that to the query
                    if (req.params.id) {
                        query = {
                            _id: req.params.id
                        };
                    }

                    // Create the query
                    var q = Model.find(query);

                    // If population parameters are true
                    var populate = !req.query.populate || req.query.populate === true || req.query.populate == 'true';
                    if (populate && populates) {
                        //Create array if populates are not an array
                        if (!Array.isArray(populates)) populates = [populates];
                        //Loop through each populate
                        populates.forEach(function (p) {
                            //Populate the query
                            q.populate(p);
                        });
                    }

                    //Run query middleware if applicable
                    if (queryMiddleware) queryMiddleware(q);

                    // Run the query
                    return q.exec(callback);
                },
                function (data, callback) {
                    // Run middleware on the object
                    middleware(data, callback);
                },
                function (items, callback) {

                    //If nothing was found, return a 404
                    if (!items) {
                        return callback({
                            status: 404
                        });
                    }

                    if (req.params.id) {
                        if (items.length < 1) {
                            //If no items, return a 404
                            return callback({
                                status: 404
                            });
                        } else if (items.length > 1) {
                            //If there is more than one item, throw an error
                            return callback({
                                status: 500
                            });
                        } else {
                            //Return with the first item in the array of found items
                            return callback(null, items[0]);
                        }
                    }

                    //Return all items found
                    return callback(null, items);
                }
            ], function (err, result) {
                // If error, console.error it and return with the error data
                if (err) {
                    console.error(err);
                    return res.status(err.status || 400).send({
                        status: err.status || 400,
                        message: err.message || 'Bad request'
                    });
                }

                return res.send(result);
            });
        };
    };

    /**
     * Depopulates an object (turns objects into IDs)
     *
     * @param {Object} body - An object to be depopulated.
     * @param {Array} populates - An array of items to depopulate.
     */
    function depopulate(body, populates) {
        //If populates is not an array, make an array out of it
        if (!Array.isArray(populates)) populates = [populates];
        //Loop through each populate
        populates.forEach(function (p) {
            //Temporary store the data for the body
            var ps = body[p];
            //If ps exists and it is an array
            if (ps && (Array.isArray('array'))) {
                //Reset the body
                body[p] = [];
                //Loop through each element in the populates
                ps.forEach(function (item) {
                    //Set items of the body to the ID of the item;
                    body[p].push(item._id);
                });
            }
        });
    }

    endpoint.depopulate = depopulate;

    /**
     * Creates a new object from a model.
     *
     * @param  {Object} Model - A model in which to create a new object from.
     * @param  {Array} populates - An array of population parameters.
     * @param  {Function} middleware - Middelware to run on a function.
     * @param  {Function} outputMiddleware - Output middleware to run after the model is created.
     */
    endpoint.create = function (Model, populates, middleware, outputMiddleware) {
        // Setup defaults if they do not exist
        if (!middleware) middleware = noop;
        if (!outputMiddleware) outputMiddleware = nooop;

        return function (req, res) {
            async.waterfall([
                function (callback) {
                    // If population parameters exist
                    var d = !req.query.depopulate || req.query.depopulate === true || req.query.depopulate == 'true';
                    if (d && populates) {
                        //Depopulate the body if necessary
                        depopulate(req.body, populates);
                    }

                    return callback(null);
                },
                function (callback) {
                    // Run the middleware on the body
                    return middleware(req.body, callback);
                },
                function (result, callback) {
                    // Create a new model
                    var n = new Model(result);

                    // Save that model
                    n.save(function (err, result) {
                        if (err) return callback(err);

                        return callback(null, result);
                    });
                },
                function (result, callback) {
                    // Run output middleware on the result
                    return outputMiddleware(result, {}, callback);
                }
            ], function (err, result) {
                // If error, console.error it and return with the error data
                if (err) {
                    console.error(err);
                    return res.status(err.status || 400).send({
                        status: err.status || 400,
                        message: err.message || 'Bad request'
                    });
                }

                return res.send(result);
            });
        };
    };

    /**
     * Updates an object from a model.
     * @param  {Object} Model - A model in which to update an object from.
     * @param  {Array} populates - An array of population parameters.
     * @param  {Function} middleware - Middelware to run on a function.
     * @param  {Function} outputMiddleware - Output middleware to run after the model is updated.
     */
    endpoint.update = function (Model, populates, middleware, outputMiddleware) {
        // Setup defaults if they do not exist
        if (!middleware) middleware = noop;
        if (!outputMiddleware) outputMiddleware = nooop;

        return function (req, res) {
            async.waterfall([
                function (callback) {
                    // If depopulation parameters exist
                    var d = !req.query.depopulate || req.query.depopulate === true || req.query.depopulate == 'true';
                    if (d && populates) {
                        //Depopulate the body if necessary
                        depopulate(req.body, populates);
                    }
                    return callback(null);
                },
                function (callback) {
                    // Create a new query
                    var q = Model.findOne({
                        _id: req.params.id
                    });

                    //Populate the model if applicable
                    if (populates) {
                        populates.forEach(function (p) {
                            q.populate(p);
                        });
                    }

                    // Run a query
                    return q.exec(callback);
                },
                function (a, callback) {
                    // Run middleware on the found object
                    return middleware(req.body, function (err, result) {
                        if (err) return callback(err);

                        return callback(null, result, a);
                    });
                },
                function (result, old, callback) {
                    //Find an object and update it
                    Model.findOneAndUpdate({
                        _id: req.params.id
                    }, result, {
                        runValidators: true,
                        new: true
                    }, function (err, a) {
                        if (err) return callback(err);

                        return callback(null, a, old);
                    });
                },
                function (result, old, callback) {
                    // Run output middleware on the result
                    return outputMiddleware(result, old, callback);
                }
            ], function (err, result) {
                // If error, console.error it and return with the error data
                if (err) {
                    console.error(err);
                    return res.status(err.status || 400).send({
                        status: err.status || 400,
                        message: err.message || 'Bad request'
                    });
                }

                return res.send(result);
            });
        };
    };

    /**
     * Deletes an object.
     *
     * @param  {Object} Model - A model to make a deletion from.
     * @param  {Function} deleteMiddleware - Deletion middleware to be used.
     */
    endpoint.delete = function (Model, deleteMiddleware) {
        // Setup delete middleware if it does not exist
        if (!deleteMiddleware) deleteMiddleware = noop;

        return function (req, res) {
            async.waterfall([
                function (callback) {
                    // Find an object to delete
                    Model.findOne({
                        _id: req.params.id
                    }, callback);
                },
                function (result, callback) {
                    //If there was not a result, return a 404
                    if (!result) {
                        return callback({
                            status: 404,
                            message: 'No object found to delete.'
                        });
                    }

                    // Run deleteMiddleware on the result
                    return deleteMiddleware(result, callback);
                },
                function (result, callback) {
                    // Remove the result from the DB
                    return result.remove(callback);
                }
            ], function (err) {
                // If error, console.error it and return with the error data
                if (err) {
                    console.error(err);
                    return res.status(err.status || 400).send({
                        status: err.status || 400,
                        message: err.message || 'Bad request'
                    });
                }

                return res.send(204);
            });
        };
    };


    /**
     * Reads the children of a Mongoose model.
     *
     * @param {Object} Model - A model to read the children from.
     * @param {Array} queryBuilder - An array/object to find data based off of.
     * @param {Array} populates - Model populates to populate an object.
     * @param {Function} queryMiddleware - Middleware to be used before a query executes.
     * @param {Function} middleware - Middleware to be used after the query executes.
     */
    endpoint.readChildren = function (Model, queryBuilder, populates, queryMiddleware, middleware) {
        // Setup middleware if it does not exist
        if (!middleware) middleware = noop;
        //If there is no queryMiddleware, set the queryMiddleware to an empty function
        if (!queryMiddleware) queryMiddleware = function () {
        };

        //If the queryBuilder is not an array, create an array out of it
        if (!Array.isArray(queryBuilder)) {
            queryBuilder = [{
                param: queryBuilder,
                queryParam: queryBuilder
            }];
        }

        return function (req, res) {
            async.waterfall([
                function (callback) {
                    var query = {};
                    //Loop through each item in the queryBuilder
                    queryBuilder.forEach(function (property) {
                        //Find params for each property
                        var a = req.params[property.param];
                        //Build query if the property params exist
                        if (a) query[property.queryParam] = a;
                    });

                    //Create the query
                    var q = Model.find(query);

                    //Set a population parameter
                    var populate = !req.query.populate || req.query.populate === true || req.query.populate == 'true';
                    if (populate && populates) {
                        //Create array if populates are not an array
                        if (!Array.isArray(populates)) populates = [populates];
                        //Loop through each populate
                        populates.forEach(function (p) {
                            //Populate the query
                            q.populate(p);
                        });
                    }

                    //Run query middleware if applicable
                    if (queryMiddleware) {
                        queryMiddleware(q);
                    }

                    // Execute the query
                    return q.exec(callback);
                },
                function (result, callback) {
                    // Run middleware on the result
                    return middleware(result, callback);
                },
                function (result, callback) {
                    if (req.params._id) {
                        //Return a 404 if no items are found
                        if (result.length < 1) return callback({
                            status: 404,
                            message: 'No items found.'
                        });
                        //Return the first element in the returned elements if there is a parameter ID
                        if (result.length < 2) return callback(null, result[0]);
                        //Return a 500 if there is more than one item
                        return callback({
                            status: 500
                        });
                    }

                    //Return all items found
                    return callback(null, result);
                }
            ], function (err, result) {
                // If error, console.error it and return with the error data
                if (err) {
                    console.error(err);
                    return res.status(err.status || 400).send({
                        status: err.status || 400,
                        message: err.message || 'Bad request'
                    });
                }

                return res.send(result);
            });
        };
    };

    return endpoint;
};