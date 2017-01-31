module.exports = function (app) {
    var db = app.get('db');
    var extend = app.get('extend');

    var mongoose = db.mongoose;
    var conn = db.conn;

    var models = {
        all: [],
        allRaw: []
    };

    models.createModel = function (m) {
        var name = m.name;
        var rawSchema = m.schema;
        var config = {
            timestamps: true
        };
        extend(config, m.config);

        models.allRaw.push(m);
        var schema = new mongoose.Schema(rawSchema, config);

        models[name + 'RawSchema'] = rawSchema;
        models[name + 'Schema'] = schema;
        var model = conn.model(name, schema);

        model.populates = m.populates;

        models[name] = model;

        models.all.push(model);
    };

    return models;
};