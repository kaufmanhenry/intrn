angular.module('intrn')
    .directive('intrnBannerComponent', function () {
        return {
            scope: {
                heading: '@intrnBannerHeadingData',
                subheading: '@intrnBannerSubheadingData'
            },
            templateUrl: 'templates/Components/Banner/Banner.html'
        };
    });