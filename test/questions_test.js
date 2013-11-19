'use strict';

var questions = require('../questions');
var _ = require('underscore');

exports.questions = {

  isValidDemographicsInput: function(test) {
    test.expect(4);

    var isValid;

    isValid = questions.isValidDemographicsInput(['m', '31']);
    test.equal(isValid, true, 'Test A');

    isValid = questions.isValidDemographicsInput(['b', '22']);
    test.equal(isValid, true, 'Test A');

    isValid = questions.isValidDemographicsInput(['male', '7']);
    test.equal(isValid, true, 'Test A');

    isValid = questions.isValidDemographicsInput(['boy', '110']);
    test.equal(isValid, true, 'Test A');

    test.done();
  },

  parseWordMessage: function(test) {
    test.expect(5);

    var elements;

    elements = questions.parseWordMessage('Male 31 ');
    test.ok(_.isEqual(elements, ['male', '31']), 'Should have removed whitespace lines in file');

    elements = questions.parseWordMessage('  Male 31 ');
    test.ok(_.isEqual(elements, ['male', '31']), 'Should have removed whitespace lines in file');

    elements = questions.parseWordMessage('Male 31');
    test.ok(_.isEqual(elements, ['male', '31']), 'Should have removed whitespace lines in file');

    elements = questions.parseWordMessage('male 31 ');
    test.ok(_.isEqual(elements, ['male', '31']), 'Should have removed whitespace lines in file');

    elements = questions.parseWordMessage(' male 31 ');
    test.ok(_.isEqual(elements, ['male', '31']), 'Should have removed whitespace lines in file');

    test.done();
  },

  demographicsQuestionHandler: function(test) {
    test.expect(1);

    questions.demographicsQuestionHandler("m 31", function(result) {
      test.ok(_.isEqual(result, { age: 31, isMale: true }));
      test.done();
    });

  }

};