'use strict'

angular.module('app').factory('flowchartStore',
  ['$q', 'GOOGLE_WORKBOOK_ID', 'GOOGLE_FLOWCHART_SHEET_ID', 'GOOGLE_OWNERS_SHEET_ID', 'googleSpreadsheetData', function($q, GOOGLE_WORKBOOK_ID, GOOGLE_FLOWCHART_SHEET_ID, GOOGLE_OWNERS_SHEET_ID, googleSpreadsheetData) {


    const OWNER_COLUMN_NAMES = [
      'flowchartheading',
      'name',
      'url',
      'introduction',
      'contactinfo'
    ]

    class Owner {
      constructor(hash) {
        this.ownerId = hash.flowchartheading.toLowerCase();
        this.name = hash.name;
        this.url = hash.url;

        this.introduction = markdown.toHTML(hash.introduction);
        this.contact = markdown.toHTML(hash.contactinfo);

        // don't keep empty strings around
        for (let k of ['ownerId', 'name', 'url', 'introduction', 'contact']) {
          if (this[k].length === 0) {
            this[k] = this[k].trim();
            this[k] = null;
          }
        }

      }
    }

    // lowercased names of columns to extract from Resources table
    const FLOWCHART_COLUMN_NAMES = [
      'stepsequence',
      'heading',
      'subheading',
      'landbank',
      'homesteadingauthority',
      'government',
      'private',
    ]

    class FlowStep {
      constructor(rowHash) {
        this.sequence = parseInt(rowHash.stepsequence, 10);
        this.heading = rowHash.heading;
        this.substeps = [];
        // this.owners[ownerId] == true if a substep has content for this owner
        this.owners = {};
        this.__subseq = 0;
      }
      addSubstep(rowHash) {
        this.substeps.push(new FlowSubstep(rowHash, this, this.__subseq++));
      }
    }

    class FlowSubstep {
      constructor(rowHash, parentStep, seq) {
        this.heading = rowHash.subheading.trim();
        if (this.heading.length === 0) {
          this.heading = null
        }
        this.parentStep = parentStep;
        this.sequence = seq;
        this.ownerContent = {};
        let ownerIds = ['landbank', 'homesteadingauthority', 'government',
          'private'];
        for (let ownerId of ownerIds) {
          let content = rowHash[ownerId].trim();
          if (content.length > 0) {
            this.ownerContent[ownerId] = markdown.toHTML(content);
            this.parentStep.owners[ownerId] = true;
          }
        }
      }
    }

    class FlowchartStore {
      constructor(ownerData, flowchartData) {
        this.owners = {};
        for (let rowHash of ownerData) {
          let ownerId = rowHash.flowchartheading.toLowerCase().trim();
          this.owners[ownerId] = new Owner(rowHash);
        }

        this.steps = {};
        let prevSeq = 0;
        for (let rowHash of flowchartData) {
          let step;
          let stepSeq = parseInt(rowHash.stepsequence, 10);
          if (!(stepSeq >= 0)) {
            stepSeq = prevSeq;
          } else {
            prevSeq = stepSeq;
          }
          if (!this.steps[stepSeq]) {
            step = new FlowStep(rowHash);
            this.steps[stepSeq] = step;
          } else {
            step = this.steps[stepSeq];
          }
          step.addSubstep(rowHash);

        }

      }

    }

    let _memoizedStore = null;

    // Return a promise that resolves to a singleton FlowchartStore instance
    function loadStore() {
      if (_memoizedStore) {
        let def = $q.defer();
        def.resolve(_memoizedStore);
        return def.promise;
      }

      let promises = {
        ownerData: googleSpreadsheetData.load(GOOGLE_WORKBOOK_ID, GOOGLE_OWNERS_SHEET_ID, OWNER_COLUMN_NAMES),
        flowchartData: googleSpreadsheetData.load(GOOGLE_WORKBOOK_ID, GOOGLE_FLOWCHART_SHEET_ID, FLOWCHART_COLUMN_NAMES)
      };

      return $q.all(promises).then(
        (hash) => {
          _memoizedStore = new FlowchartStore(
            hash.ownerData, hash.flowchartData);
          return _memoizedStore;
        }, (err) => {
          return $q.reject(err);
        });

    }

    return {load: loadStore};

}]);