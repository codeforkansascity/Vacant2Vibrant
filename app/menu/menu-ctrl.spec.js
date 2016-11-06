describe('MenuCtrl', function() {
  beforeEach(module('app'));

  let mkCtrl;

  beforeEach(angular.mock.inject(function($controller) {
    mkCtrl = () => {
      return $controller('MenuCtrl', {});
    }
  }));

  describe('feature', function() {
    it('should do something', function() {
      let ctrl = mkCtrl();
      expect(true).toEqual(true);
    });
  });
});