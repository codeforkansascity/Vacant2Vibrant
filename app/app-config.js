'use strict'

angular.module('app').config(
  ['$routeProvider', function($routeProvider) {

    $routeProvider.when('/about', {
      templateUrl: './about/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'ctrl',
      activePage: 'about'
    });

    $routeProvider.when('/', {
      templateUrl: './home/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'ctrl',
      activePage: 'home'
    });

    $routeProvider.when('/flowchart/:ownerId', {
      templateUrl: './flowchart/flowchart.html',
      controller: 'FlowchartCtrl',
      controllerAs: 'ctrl',
      activePage: 'flowchart',
      resolve: {fStore: flowchartRouteResolver}
    });

    function flowchartRouteResolver(flowchartStore) {
      return flowchartStore.load();
    }
    flowchartRouteResolver.$inject = ['flowchartStore'];

    $routeProvider.when('/resources', {
      templateUrl: './resources/resources.html',
      controller: 'ResourcesCtrl',
      controllerAs: 'ctrl',
      activePage: 'resources',
      resolve: {rStore: resourcesRouteResolver}
    });

    function resourcesRouteResolver(resourceStore) {
      return resourceStore.load();
    }
    resourcesRouteResolver.$inject = ['resourceStore'];

    $routeProvider.otherwise({ redirectTo: '/' });

}]);


// config google spreadsheet
angular.module('app').constant('GOOGLE_WORKBOOK_ID',
  '1Yw2NWmK5cEDDdlChs9SvyfHXKGlcO_qn56E4IeHdQ5Y');
angular.module('app').constant('GOOGLE_FLOWCHART_SHEET_ID', '1');
angular.module('app').constant('GOOGLE_OWNERS_SHEET_ID', '2');
angular.module('app').constant('GOOGLE_RESOURCES_SHEET_ID', '3');