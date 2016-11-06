'use strict'

/**
 * the googleSpreadsheetData service has a single load function.
 *
 * load() Returns a promise which resolves to a memoized object.
 * @param {String} docId — Google workbook ID
 * @param {String} sheetId — ID of sheet within workbook
 * @param {Array} columns — list of columns (by ID) to retrieve
 * @return {Promise}
*/

/*

Setting up a Google Spreadsheet --

1. Create spreadsheet, then do File > Publish to the Web.
2. The defaults should be fine. When you publish, you'll see a dialog box with
   a URL. This URL contains the spreadsheet key (supply to the `load()`
   function)
3. The sheet IDs appear to be numbered sequentially. Try inserting 1/2/3 for the
   sheet ID in this URL until you get data that looks correct.

   https://spreadsheets.google.com/feeds/list/${docId}/${sheetId}/public/values?alt=json

*/

angular.module('app').factory('googleSpreadsheetData', ['$http', '$q', function($http, $q) {

  // memoized data
  var _cache = {};

  return { load: load }

  function load(docId, sheetId, columns) {
    let key = docId+'+'+sheetId;
    if (_cache[key]) {
      let def = $q.defer();
      def.resolve(_cache[key]);
      return def.promise;
    }
    let url = `https://spreadsheets.google.com/feeds/list/${docId}/${sheetId}/public/values?alt=json`;
    return $http({method: 'GET', url: url}).then(
        // success
        (result) => {
          let entry, table = [];
          for (entry of result.data.feed.entry) {
            let colName, rowData = {};
            for (colName of columns) {
              let colKey = 'gsx$'+colName;
              if (!entry[colKey]) {
                let msg = `column "${colName}" not Found`;
                console.error(msg);
                return $q.reject(msg);
              }
              rowData[colName] = entry[colKey].$t
            }
            table.push(rowData);
          }
          _cache[key] = table;
          let def = $q.defer();
          def.resolve(_cache[key]);
          return def.promise;
        },

        // failure
        (err) => {
          return $q.reject(err);
        });
    } // END load

}]);