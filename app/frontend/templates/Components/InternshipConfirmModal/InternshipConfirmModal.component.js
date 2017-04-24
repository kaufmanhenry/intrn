angular.module('intrn')
    .directive('intrnInternshipConfirmModal', function () {
        return {
            scope: {
                close: '&intrnClose',
                cancel: '&intrnCancel'
            },
            templateUrl: 'templates/Components/InternshipConfirmModal/InternshipConfirmModal.html'
        }
    });