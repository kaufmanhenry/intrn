module.exports = function (app) {
    var mongoose = app.get('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    return {
        name: 'Company',
        path: '/companies',
        route: require('./Company.route'),
        populates: ['users'],
        schema: {
            name: {
                type: String,
                required: true
            },
            users: [{
                type: ObjectId,
                ref: 'User'
            }]
        }
    };
};