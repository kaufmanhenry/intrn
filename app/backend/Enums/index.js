module.exports = function (app) {
    var enums = {
        Locations: require('./Locations.enum'),
        JobTypes: require('./JobTypes.enum'),
        Roles: require('./Roles.enum'),
        Schools: require('./Schools.enum')
    };

    Object.keys(enums).forEach(function (key) {
        var structure = enums[key];
        var list = Object.keys(structure).map(function (key2) {
            return structure[key2];
        });
        enums['All' + key] = list;
    });

    return enums;
};