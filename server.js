
/**
 * Module dependencies.
 */
var express = require('express');
var sms = require('./sms');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var questions = require('./questions');
var location = require('./location');

var io;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8082);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// State of Questions and Data ------------------------------------------

var currentQuestion = "";
var questionResponseData = {};

var resetQuestionData = function() {
  questionResponseData = {
    travel: [],
    demographics: [],
    cloud: []
  };
};

resetQuestionData();

// Routes ----------------------------------------------------------------

app.get('/resetAllData', function(req, res, next) {
  resetQuestionData();
  res.send(200);
});

app.get('/setQuestion', function(req, res, next) {
  currentQuestion = req.query.q;
  var data = {};
  if(questionResponseData.hasOwnProperty(currentQuestion)) {
    data = questionResponseData[currentQuestion];
  }
  res.json({data: data});
});

app.post('/sms', function(req, res, next) {

  // Send TWIML Response Acknowledging Message
  res.send('<Response></Response>');

  // Handle Depending on the Active Question
  executeHandlerForCurrentQuestion(req, res, next);

});

// Handling of Text Messages per Question --------------------------------

var questionHandlers = {};

var executeHandlerForCurrentQuestion = function(req, res, next) {
  var message = req.body.Body;
  if(questionHandlers.hasOwnProperty(currentQuestion)) {
    var handler = questionHandlers[currentQuestion];
    handler(message, req, res, next);
  } else {
    console.log("No Handler for Defined Question");
  }
};

var travelHandler = function(message, req, res, next) {
  location.parseLocationInput(req)
  .then(function(result) {
    console.log("Location Result");
    console.dir(result);
    if(result) {
      questionResponseData.travel.push(result);
      io.sockets.emit('location', result);
    }
  });
};

var demographicsHandler = function(message, req, res, next) {
  questions.demographicsQuestionHandler(req.body.Body, function(result) {
    if(result) {
      questionResponseData.demographics.push(result);
      io.sockets.emit('demographics', result);
    }
  });
};

questionHandlers = {
  "travel" : travelHandler,
  "demographics" : demographicsHandler
};

// Creating Express Server and Websocket Support -------------------------

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io = socketIO.listen(server);
