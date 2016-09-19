#!/usr/bin/env node


var sqs //= require('sqs')
        = require("easy-sqs")
;

var configMap = {
  iam_key : process.env.IAM_MON_KEY,
  iam_sec : process.env.IAM_MON_SECRET,
  region  : 'us-west-2',
  qname   : 'heartbeat',
  url     : 'https://sqs.us-west-2.amazonaws.com/209956794958/heartbeat',
  host    : 'pfm.flny.ch'
},
awsConfig = {
  "accessKeyId":     configMap.iam_key,
  "secretAccessKey": configMap.iam_sec,
  "region":          configMap.region
},
client = sqs.createClient(awsConfig),

/*
queue = sqs({
  access: configMap.iam_key,
  secret: configMap.iam_sec,
  region: configMap.region
}),*/
send
;

/*
send = function() {
  queue.push(configMap.qname, {
    some: configMap.host + ' is alive.'
  }, function() {
    console.log('message sent.');
  })
}
*/


send = function() {
  client.getQueue(configMap.url, function(err, queue) {
      if(err) {
        console.error(err);
        throw err;
      }
      var msg = JSON.stringify({body: configMap.host + ' is alive.'});
      queue.sendMessage(msg, function(err) {
        if(err) {
          console.error(err);
          throw err;
        }else{
          console.log('message sent.');
        }
      });
  });
};

send();
