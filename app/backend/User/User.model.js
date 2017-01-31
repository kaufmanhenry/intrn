module.exports = function (app) {
    var mongoose = app.get('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var enums = app.get('enums');

    return {
        name: 'User',
        path: '/users',
        route: require('./User.route'),
        populates: ['companies'],
        schema: {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            accessToken: {
                type: String,
                required: true
            },
            companies: [{
                type: ObjectId,
                ref: 'Company'
            }]
        }
    };
};