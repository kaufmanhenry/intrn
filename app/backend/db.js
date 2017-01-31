module.exports = function (app) {
    var config = app.get('config');
    var mongoose = app.get('mongoose');

    console.info('Connencting to MongoDB at: ' + config.db);
    var conn = mongoose.createConnection(config.db);

    return {
        conn: conn,
        mongoose: mongoose
    };
};