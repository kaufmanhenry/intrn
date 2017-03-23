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
                required: false
            },
            lastName: {
                type: String,
                required: false
            },
            school: {
                type: Object,
                enum: enums.AllSchools,
                required: false
            },
            email: {
                type: String,
                required: false
            },
            phone: {
                type: String,
                required: false
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
                required: false
            },
            job: {
                type: ObjectId,
                ref: 'Job'
            }
        }
    };
};