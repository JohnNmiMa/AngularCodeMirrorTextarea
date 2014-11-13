describe('makeEditable', function () {

    var scope, element, compiled, html;

    beforeEach(module("editDirective"));
    beforeEach(module("make-editable-template.html"));
    beforeEach(inject(function($rootScope, $compile) {
        html  = "<div make-editable>"
        html += "    <h3>The Title</h3>"
        html += "    <p>The editable paragraph</h3>"
        html += "</div>";

        scope = $rootScope.$new();
        compiled = $compile(html);
        element = compiled(scope);
        scope.$digest();
    }));

    it('should render the make-editable section correctly', function() {
        expect(element.find('div[contenteditable="false"]')).toBeTruthy();
        expect(element.find('h3').length).toBe(1);
        expect(element.find('p').length).toBe(1);
        expect(element.find('button').text()).toContain('Edit');
    });
});
