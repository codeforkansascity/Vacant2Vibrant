angular.module('app').controller('MenuCtrl',
['$rootScope', '$route', function($rootScope, $route) {
  'use strict'
  class MenuCtrl {
    constructor() {
      $rootScope.$on('$locationChangeSuccess', () => {
        this.activePage = $route.current.activePage;
      });
    }
  }

  return new MenuCtrl();
}
]);