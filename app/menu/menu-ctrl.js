angular.module('app').controller('MenuCtrl',
['$rootScope', '$route', '$routeParams', function($rootScope, $route, $routeParams) {
  'use strict'
  class MenuCtrl {
    constructor() {
      $rootScope.$on('$locationChangeSuccess', () => {
        this.activePage = $route.current.activePage;
        this.params = $routeParams;
      });
    }
  }

  return new MenuCtrl();
}
]);