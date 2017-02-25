module.exports = function (app) {
    var mongoose = app.get('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var enums = app.get('enums');

    return {
        name: 'Job',
        path: '/jobs',
        route: require('./Job.route'),
        populates: ['company'],
        schema: {
            title: {
                type: String,
                required: true
            },
            industry: {
                type: String,
                required: true
            },
            companyName: {
                type: String,
                required: true
            },
            companyWebsite: {
                type: String,
                required: true
            },
            canDo: {
                type: String,
                required: true
            },
            requirements: {
                type: String,
                required: true
            },
            perks: {
                type: String,
                required: true
            },
            role: {
                type: Object,
                enum: enums.AllRoles,
                required: true
            },
            location: {
                type: Object,
                enum: enums.AllLocations,
                required: true
            },
            jobType: {
                type: Object,
                enum: enums.AllJobTypes,
                required: true
            },

            company: {
                type: ObjectId,
                ref: 'Company'
            },

            jobCreatedTime: {
                type: Date,
                required: true,
                default: Date.now()
            },

            interest: {
                type: Number,
                required: true,
                default: 0
            },

            interested: {
                type: Number,
                required: true,
                default: 0
            }
        }
    };
};