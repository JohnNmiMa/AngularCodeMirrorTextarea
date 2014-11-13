angular.module('CodeMirror', ['ui.codemirror'])

.directive('snippet', [function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: './snippet.html',
            controller: function($scope, $element, $attrs) {
                $scope.snippetData = {};
                $scope.snippetData.code = localStorage['snippetCodeModel'];

                $scope.isEditing = false;
                $scope.lineWrapping = false;
                $scope.lineNumbers = true;

                // The codemirror editor options must be done in a controller
                // (won't work in the link function)
                $scope.codeEditorOptions = {
                    lineWrapping : $scope.lineWrapping,
                    indentUnit: 4,
                    lineNumbers: $scope.lineNumbers,
                    readOnly: 'nocursor',
                    mode: 'javascript'
                };
            },
            link: function(scope, element, attrs, snippetCtrl) {
                // Use this 'link' function to do any DOM or jQuery manipulation
                // (won't work in the controller

                var cmElement = element.find('.CodeMirror'),
                    cmScrollElement = element.find('.CodeMirror-scroll'),
                    scrolling = true,
                    textDecorationNoneStyle = {'text-decoration':'none'},
                    textDecorationLineThroughStyle = {'text-decoration':'line-through'};

                scope.refreshIt = true;
                scope.scrollStrikeStyle = textDecorationNoneStyle;
                scope.wrapStrikeStyle = textDecorationLineThroughStyle;
                scope.lineNumberStrikeStyle = textDecorationNoneStyle;

                scope.toggleEdit = function(snippetData) {
                    scope.isEditing = !scope.isEditing
                    if (scope.isEditing) {
                        scope.codeEditorOptions.readOnly = false;
                        cmElement.addClass('isEditing');
                    } else {
                        saveCode(snippetData.code);
                        terminateEditing();
                    }
                };

                scope.cancelEdit = function() {
                    if (scope.isEditing) {
                        scope.isEditing = false;
                        scope.snippetData.code = localStorage['snippetCodeModel'];
                        terminateEditing();
                    }
                };

                scope.toggleScroll = function() {
                    scrolling = !scrolling;
                    scope.scrollStrikeStyle =
                        scrolling ? textDecorationNoneStyle : textDecorationLineThroughStyle;
                    if (scrolling) {
                        // Set CodeMirror scroll element to scroll in window of max-height = 400px
                        cmScrollElement.css({
                            'overflow':'auto',
                            'max-height':'400px'
                        })
                    } else {
                        // Set CodeMirror scroll element to expand to code size
                        cmScrollElement.css({
                            'overflow-x':'auto',
                            'overflow-y':'hidden',
                            'height':'auto',
                            'max-height':'none'
                        })
                    }
                    scope.refreshIt = !scope.refreshIt;
                };

                scope.toggleLineWrap = function() {
                    scope.lineWrapping = !scope.lineWrapping;
                    scope.wrapStrikeStyle =
                        scope.lineWrapping ? textDecorationNoneStyle : textDecorationLineThroughStyle;
                    if (scope.lineWrapping) {
                        scope.codeEditorOptions.lineWrapping = true;
                    } else {
                        scope.codeEditorOptions.lineWrapping = false;
                    }
                };

                scope.toggleLineNumbers = function() {
                    scope.lineNumbers = !scope.lineNumbers;
                    scope.codeEditorOptions.lineNumbers = scope.lineNumbers;
                    scope.lineNumberStrikeStyle =
                        scope.lineNumbers ? textDecorationNoneStyle : textDecorationLineThroughStyle;
                };

                function terminateEditing() {
                    cmElement.removeClass('isEditing');
                    // This line sets the textarea to readonly
                    scope.codeEditorOptions.readOnly = 'nocursor';
                }

                function saveCode(codeModel) {
                    localStorage['snippetCodeModel'] = codeModel;
                }
            }
        }
    }]);
