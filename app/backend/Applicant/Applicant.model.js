module.exports = function (app) {
    var mongoose = app.get('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var enums = app.get('enums');

    return {
        name: 'Applicant',
        route: require('./Applicant.route'),
        schema: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            school: {
                type: Object,
                enum: enums.AllSchools,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            bio: {
                type: String,
                required: true
            },
            job: {
                type: ObjectId,
                ref: 'Job'
            }
        }
    };
};