var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
var q = require('q');

exports.sendMessage = function(to, message) {
	var deferred = q.defer();

	client.sendSms(
		{
			to:to,
			from:'+14232440540',
			body: message
		}, function(error, message) {
		if (!error) {
			console.log('Success! The SID for this SMS message is:');
			console.log(message.sid);
		 	console.log('Message sent on:');
			console.log(message.dateCreated);
			deferred.resolve();
		} else {
			console.log("Failed to Send Message");
			console.log(error);
			deferred.reject(error);
		}
	});

	return deferred.promise;
}