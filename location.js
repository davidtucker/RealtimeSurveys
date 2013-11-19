var url = require('url');
var geocoder = require('geocoder');
var q = require('q');
var sms = require('./sms');

exports.parseLocationInput = function(req) {
	var from = req.body.From;
	var input = req.body.Body;

	return geocodeInput(input)
	.then(function(result) {
		if(result.status != 'ZERO_RESULTS') {
			return result.results[0].geometry.location;
		} else {
			return sms.sendMessage(from, "Unable to geocode location :(");
		}
	}, function(err) {
		return sms.sendMessage(from, "Unable to geocode location :(");
	});
};

var geocodeInput = function(input) {
	var deferred = q.defer();

	geocoder.geocode(input, function ( err, data ) {
	  if(err) {
	  	deferred.reject(err);
	  } else {
	  	deferred.resolve(data);
	  }
	});

	return deferred.promise;
};
