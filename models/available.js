const mongoose = require('mongoose');
const config = require('../config');
const mpromise = require('mpromise')
var Token = require('../models/token.js');
var util = require('util');
var mongoDB_URL = config.mongoDB_URL;
var deasync = require('deasync');

mongoose.connect(config.mongoDB_URL, {
  useMongoClient: true
});

var done1 = false;

setInterval(function(){
  Token.count({ 'really.sofar': 'nyess' }).exec(function(err, c) {
    global.availableTokens = c;
    global.tokensNeededs = config.tokens - availableTokens;
    done1 = true;
  });
}, 1000);
require('deasync').loopWhile(function(){return !done1;});
