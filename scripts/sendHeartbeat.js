#!/usr/bin/env node


var sqs = require('sqs')
;

var configMap = {
  iam_key : process.env.IAM_MON_KEY,
  iam_sec : process.env.IAM_MON_SECRET,
  region  : 'us-west-2',
  qname   : 'heartbeat',
  host    : 'pfm.flny.ch'
},
queue = sqs({
  access: configMap.iam_key,
  secret: configMap.iam_sec,
  region: configMap.region
}),
send
;


send = function() {
  queue.push(configMap.qname, {
    some: configMap.host + ' is alive.'
  }, function() {
    console.log('message sent.');
  })
}


send();
