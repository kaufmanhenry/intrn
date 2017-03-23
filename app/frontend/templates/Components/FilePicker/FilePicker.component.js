//This code was written by Jake Billings. He's a great developer. You can learn more about him at jakebillings.com
angular.module('intrn')
    .directive('intrnFilePickerComponent', function () {
        return {
            scope: {
                onLoad: '&intrnOnLoad',
                onSelect: '&intrnOnSelect',

                accept: '@intrnAccept',

                buttonText: '@?intrnButtonText'
            },
            templateUrl: 'templates/Components/FilePicker/FilePicker.html',
            link: function (scope, element) {
                var input = element.find('input');

                scope.clickEvent = function () {
                    input.click();
                };

                scope.onFileUpdate = function (target) {
                    //If the file changes, load the new file and store it in the appropriate variable.
                    var file = target.files[0];
                    scope.file = file;
                    scope.onSelect({file: file});

                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        scope.$apply(function ($scope) {
                            $scope.uri = evt.target.result;
                            scope.onLoad({file: file, uri: evt.target.result});
                        });
                    };
                    reader.readAsDataURL(file);
                };
            }
        };
    });