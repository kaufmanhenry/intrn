angular.module('intrn')
    .factory('Actions', ['$uibModal', function ($uibModal) {
        var Actions = {};

        Actions.openConfirmModal = function (title, text, modalType, actionText, hideCancel, successFunction, cancelFunction) {
            return $uibModal.open({
                animation: true,
                template: '<intrn-confirm-modal intrn-close="close()" intrn-action-text="{{actionText}}" intrn-cancel="cancel()" intrn-data-title="{{title}}" intrn-data-text="{{text}}" intrn-data-modal-type="{{modalType}}" intrn-data-hide-cancel="hideCancel"></intrn-confirm-modal>',
                controller: ['$uibModalInstance', '$scope', function ($uibModalInstance, scope) {
                    scope.title = title;
                    scope.text = text;
                    scope.modalType = modalType;
                    scope.actionText = actionText;
                    scope.successFunction = successFunction;
                    scope.cancelFunction = cancelFunction;
                    scope.hideCancel = hideCancel;
                    scope.close = function () {
                        $uibModalInstance.close();
                        successFunction();
                    };
                    scope.cancel = function () {
                        $uibModalInstance.dismiss();
                        cancelFunction();
                    };
                }]
            });
        };

        return Actions;
    }]);