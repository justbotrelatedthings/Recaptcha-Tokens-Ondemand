var mongoose = require('mongoose');
var _ = require('lodash');
var request = require('request');
var solver = require('2captcha');
var config = require('./config');
var mpromise = require('mpromise')
var Token = require('./models/token.js');
var available = require('./models/available.js');

/*Needs callback to remove token after usage*/

solver.setApiKey(config.twoC);

var captcha = config.sitekey;
var pageUrl = config.url;
var mongoDB_URL = config.mongoDB_URL;

mongoose.connect(config.mongoDB_URL, {
  useMongoClient: true
});

global.solving = 0;

var timesRan = 0;
console.log("Aiming for "+config.tokens+" token(s) available all time.")
setInterval(function(){
console.log(availableTokens + " available token(s)")
var reallyNeeded = tokensNeededs - solving;
if (solving + availableTokens < config.tokens && reallyNeeded > 0) {
  console.log("Generating " + reallyNeeded + " token(s)")
  var tokenArr = new Array(reallyNeeded);
  _.each(tokenArr, function (i) {
  ++solving;
  solver.decodeReCaptcha(
      captcha,
      pageUrl,
      {pollingInterval: 1000},
      function(err, result) {
        console.log(result);
        if(err == "ERROR_NO_SLOT_AVAILABLE"){
          console.log('No SLOT AVAILABLE we will be RETRYING')
          --solving;
          return false;
        } else {console.log(err)}
        console.log(result);
        new Token({ 'token': result.text, 'really.sofar': 'nyess' }).save(); /*I use really.sofar in my bot to know if I have reserved a token for usage and later release it if its not used and remove if used*/
        ++timesRan;
        console.log("Token " + (timesRan.toString()) + " saved");
        --solving;
        if (tokensNeededs == 0) {
          console.log("We don't need any tokens right now")
        --solving;
        }
      })
  });
} else if (availableTokens == config.tokens){
  console.log("We do not need to generate any tokens right now");
}
else {
  console.log("Waiting on "+solving+" token(s)");
}
}, 5000);
