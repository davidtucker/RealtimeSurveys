var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

// Demographics & Gender Answrs
var acceptableMaleGenderAnswers = [ 'm', 'male', 'boy', 'b'  ];
var acceptableFemaleGenderAnswers = [ 'f', 'female', 'girl', 'g' ];
var acceptableGenderAnswers = _.union(acceptableMaleGenderAnswers, acceptableFemaleGenderAnswers);

var demographicsQuestionHandler = function(message, callback) {
	var elements = parseWordMessage(message);
	if(isValidDemographicsInput(elements))
	{
		var age, isMale, gender;

		age = _.find(elements, _.isFinite);
		gender = _(elements).chain().intersection(acceptableGenderAnswers).first().value();
		isMale = _.contains(acceptableMaleGenderAnswers, gender);
		callback({ age: parseInt(age), isMale: isMale });
	}
	else
	{
		callback(null);
	}
};

var cloudQuestionHandler = function(io, req, res, next) {
	var message = req.body.Body;
	var words = parseWordMessage(message);

};

/**
	This method parses an input string from the SMS message and produces an
	output array with the elements from the message by splitting on a space.
	It also trims each element and makes each item lower case.
*/
var parseWordMessage = function(input) {
	var elements = input.split(" ");
	_.each(elements, function(str, idx, arr) {
		arr[idx] = _.trim(str.toLowerCase());
	});
	return _.compact(elements);
};

/**
	This method does validation on the array generated from splitting the
	SMS message content on a space.  It needs to meet the following criteria:

	1.  After being split it should be an array
	2.  The array should have a length of 2
	3.  The array should contain a finite number (for the age)
	4.  The array should contain one of the acceptable gender answers
*/
var isValidDemographicsInput = function(input) {
	if(_.isArray(input) && input.length == 2 && _.some(input, _.isFinite) 
		&& _.intersection(input, acceptableGenderAnswers).length == 1) {
		return true;
	}
	return false;
};

/** 
	By defining the exports, we make these available to those classes which import
	this module.  This follows the CommonJS Module Specification:

	http://wiki.commonjs.org/wiki/Modules/1.1
*/
exports.parseWordMessage = parseWordMessage;
exports.isValidDemographicsInput = isValidDemographicsInput;
exports.demographicsQuestionHandler = demographicsQuestionHandler;
