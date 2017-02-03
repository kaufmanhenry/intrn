module.exports = function (app) {
    var mongoose = app.get('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var enums = app.get('enums');

    return {
        name: 'Applicant',
        path: '/applicants',
        route: require('./Applicant.route'),
        populates: ['job'],
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

            twitter: {
                type: String,
                required: false
            },
            linkedin: {
                type: String,
                required: false
            },
            github: {
                type: String,
                required: false
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