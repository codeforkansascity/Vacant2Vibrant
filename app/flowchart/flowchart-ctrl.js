angular.module('app').controller('FlowchartCtrl',
['$routeParams', 'fStore', function($routeParams, fStore) {
  'use strict'
  class FlowchartCtrl {
    constructor() {
      this.owner = fStore.owners[$routeParams.ownerId];
      let steps = [];
      for (let seq in fStore.steps) {
        let step = fStore.steps[seq];
        if (step.owners[this.owner.ownerId]) {
          steps.push(step);
        }
      }
      this.steps = steps;
      this.activeStep = null;
      this.activeSubstep = null;

    }

    showStep(stepSeq, substepIdx) {
      if (stepSeq === null) {
        this.activeStep = null;
        this.activeSubstep = null;
        return
      }
      substepIdx = parseInt(substepIdx, 10);
      this.activeStep = fStore.steps[stepSeq];
      this.activeSubstep = this.activeStep.substeps[substepIdx];
    }

  }
  return new FlowchartCtrl();

}
]);