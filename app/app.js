angular.module('CodeMirror', ['ui.codemirror'])

.directive('snippet', [function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: './snippet.html',
            controller: function($scope, $element, $attrs) {
                $scope.isEditing = false,
                $scope.snippetData = {};
                $scope.snippetData.code = localStorage['snippetCodeModel'];

                $scope.codeEditorOptions = {
                    lineWrapping : true,
                    indentUnit: 4,
                    lineNumbers: false,
                    readOnly: 'nocursor',
                    mode: 'javascript'
                };

                $scope.toggleEdit = function(snippetData) {
                    $scope.isEditing = !$scope.isEditing
                    if ($scope.isEditing) {
                        $scope.codeEditorOptions.readOnly = false;
                        $('.CodeMirror').addClass('isEditing');
                    } else {
                        saveCode(snippetData.code);
                        terminateEditing();
                    }
                };

                $scope.cancelEdit = function() {
                    if ($scope.isEditing) {
                        $scope.isEditing = false;
                        $scope.snippetData.code = localStorage['snippetCodeModel'];
                        terminateEditing();
                    }
                };

                function terminateEditing() {
                    $('.CodeMirror').removeClass('isEditing');
                    // This line sets the textarea to readonly
                    $scope.codeEditorOptions.readOnly = 'nocursor';
                }

                function saveCode(codeModel) {
                    localStorage['snippetCodeModel'] = codeModel;
                }

            },
            link: function(scope, element, attrs, snippetCtrl) {
                var scrolling = true,
                    lineWrapping = true,
                    lineNumbers = false,
                    cmScroll = element.find('.CodeMirror-scroll');

                scope.toggleScroll = function(event) {
                    scrolling = !scrolling;
                    if (scrolling) {
                        // Set textarea to scroll in window of max-height = 400px
                        $(event.delegateTarget).css({'text-decoration':'none'});
                        cmScroll.css({
                            'overflow':'auto',
                            'max-height':'400px'
                        });
                    } else {
                        // Set textarea to expand to code size
                        $(event.delegateTarget).css({'text-decoration':'line-through'});
                        cmScroll.css({
                            'overflow-x':'auto',
                            'overflow-y':'hidden',
                            'height':'auto',
                            'max-height':'none'
                        });
                    }
                };

                scope.toggleLineWrap = function(event) {
                    lineWrapping = !lineWrapping;
                    if (lineWrapping) {
                        $(event.delegateTarget).css({'text-decoration':'none'});
                        scope.codeEditorOptions.lineWrapping = true;
                    } else {
                        $(event.delegateTarget).css({'text-decoration':'line-through'});
                        scope.codeEditorOptions.lineWrapping = false;
                    }
                }

                scope.toggleLineNumbers = function() {
                    lineNumbers = !lineNumbers;
                    scope.codeEditorOptions.lineNumbers = lineNumbers;
                }
            }
        }
    }]);
