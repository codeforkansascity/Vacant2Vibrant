describe('ComponentTemplateCtrl', function() {
  beforeEach(module('app'));

  let mkCtrl;

  beforeEach(angular.mock.inject(function($controller) {
    mkCtrl = () => {
      return $controller('ComponentTemplateCtrl', {});
    }
  }));

  describe('feature', function() {
    it('should do something', function() {
      let ctrl = mkCtrl();
      expect(true).toEqual(true);
    });
  });
});