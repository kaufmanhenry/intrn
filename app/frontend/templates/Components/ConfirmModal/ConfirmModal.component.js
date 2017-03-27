angular.module('intrn')
    .directive('intrnConfirmModal', function () {
        return {
            scope: {
                close: '&intrnClose',
                cancel: '&intrnCancel',
                actionText: '@intrnActionText',
                title: '@intrnDataTitle',
                text: '@intrnDataText',
                modalType: '@intrnDataModalType',
                hideCancel: '=intrnDataHideCancel'
            },
            templateUrl: 'templates/Components/ConfirmModal/ConfirmModal.html'
        }
    });