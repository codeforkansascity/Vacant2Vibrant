'use strict'

// note: 'rStore' injected here is the object created when the
// resourcesRouteResolver (see app-config.js) resolves the promise
// returned by resourceStore.load()

angular.module('app').controller('ResourcesCtrl',
['rStore', function(rStore) {


  class ResourcesCtrl {
    constructor() {
      this.resources = rStore.resources;
    }
  }
  return new ResourcesCtrl();
}
]);