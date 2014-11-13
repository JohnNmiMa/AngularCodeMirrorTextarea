angular.module('CodeMirror', ['ui.codemirror'])

.directive('snippet', [function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: './snippet.html',
            controller: function($scope, $element, $attrs) {
                var lineWrapping = false,
                    lineNumbers = true,
                    textDecorationNoneStyle = {'text-decoration':'none'},
                    textDecorationLineThroughStyle = {'text-decoration':'line-through'};

                $scope.snippetData = {};
                $scope.snippetData.code = localStorage['snippetCodeModel'];

                $scope.isEditing = false;

                $scope.scrollStrikeStyle = textDecorationNoneStyle;
                $scope.wrapStrikeStyle = textDecorationLineThroughStyle;
                $scope.lineNumberStrikeStyle = textDecorationNoneStyle;

                $scope.codeEditorOptions = {
                    lineWrapping : lineWrapping,
                    indentUnit: 4,
                    lineNumbers: lineNumbers,
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

                $scope.toggleLineWrap = function() {
                    lineWrapping = !lineWrapping;
                    $scope.wrapStrikeStyle =
                        lineWrapping ? textDecorationNoneStyle : textDecorationLineThroughStyle;
                    if (lineWrapping) {
                        $scope.codeEditorOptions.lineWrapping = true;
                    } else {
                        $scope.codeEditorOptions.lineWrapping = false;
                    }
                };

                $scope.toggleLineNumbers = function() {
                    lineNumbers = !lineNumbers;
                    $scope.codeEditorOptions.lineNumbers = lineNumbers;
                    $scope.lineNumberStrikeStyle =
                        lineNumbers ? textDecorationNoneStyle : textDecorationLineThroughStyle;
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
                var cmScroll = element.find('.CodeMirror-scroll'),
                    scrolling = true,
                    textDecorationNoneStyle = {'text-decoration':'none'},
                    textDecorationLineThroughStyle = {'text-decoration':'line-through'};

                scope.refreshIt = true;

                scope.toggleScroll = function() {
                    scrolling = !scrolling;
                    scope.scrollStrikeStyle =
                        scrolling ? textDecorationNoneStyle : textDecorationLineThroughStyle;
                    if (scrolling) {
                        // Set textarea to scroll in window of max-height = 400px
                        cmScroll.css({
                            'overflow':'auto',
                            'max-height':'400px'
                        })
                    } else {
                        // Set textarea to expand to code size
                        cmScroll.css({
                            'overflow-x':'auto',
                            'overflow-y':'hidden',
                            'height':'auto',
                            'max-height':'none'
                        })
                    }
                    scope.refreshIt = !scope.refreshIt;
                };
            }
        }
    }]);
