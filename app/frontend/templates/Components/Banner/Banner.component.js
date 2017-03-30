angular.module('intrn')
    .directive('intrnBannerComponent', function () {
        return {
            scope: {
                heading: '@intrnBannerHeadingData',
                subheading: '@intrnBannerSubheadingData',
                bannerImage: '@intrnBannerImage'
            },
            templateUrl: 'templates/Components/Banner/Banner.html'
        };
    });