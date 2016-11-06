'use strict'

angular.module('app').factory('resourceStore',
  ['$q', 'GOOGLE_WORKBOOK_ID', 'GOOGLE_RESOURCES_SHEET_ID', 'googleSpreadsheetData', function($q, GOOGLE_WORKBOOK_ID, GOOGLE_RESOURCES_SHEET_ID, googleSpreadsheetData) {

    // lowercased names of columns to extract from Resources table
    const RESOURCE_COLUMNS = [
      'name',
      'description',
      'url'
    ]

    class ResourceStore {
      constructor(googleData) {
        this.resources = googleData;

        // TODO: process markdown in description column?
      }

    }

    let _memoizedStore = null;

    // Return a promise that resolves to a singleton ResourceStore instance
    function loadStore() {
      if (_memoizedStore) {
        let def = $q.defer();
        def.resolve(_memoizedStore);
        return def.promise;
      }
      return googleSpreadsheetData.load(
        GOOGLE_WORKBOOK_ID,
        GOOGLE_RESOURCES_SHEET_ID,
        RESOURCE_COLUMNS).then(
      (data) => {
        _memoizedStore = new ResourceStore(data);
        let def = $q.defer();
        def.resolve(_memoizedStore);
        return def.promise;
      },
      (err) => {
        console.error(err);
        return $q.reject(err);
      });
    }

    return {load: loadStore};

}]);