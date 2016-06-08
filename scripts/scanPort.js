#!/usr/bin/env node

var scanner = require('node-netcat').portscan(),
    logger = require('./logger'),
    async  = require('async')
;


var configMap = {
  host  :'pfm.flny.ch',
  ports : ['43021', '53', '445', '8200', '8201'],
  udpErrorStr : 'protocol \"udp\" with message',
  msgPath : '/mnt/pub/misc/monitor/'
},
errMessages,
scanPorts,
scanAPort
;


scanAPort = function(port) {
  scanner.run(configMap.host, port, function(err, res) {
    if(err && err.indexOf(configMap.udpErrorStr) == -1) {
      return err + '\n';
    }else{
      return '';
    }
  });
}

scanPorts = function() {
  console.log(configMap.ports + ' checking...');
  var messages = '';

  for(var i=0; i<configMap.ports.length; i++)  {
    messages += scanAPort(configMap.ports[i]);
  }

  console.log(messages);
  return messages;
  
}


errMessages = scanPorts();
if(errMessages != '') {
  console.log(errMessages);
  logger.log(logger.categorySystemError, errMessages);
};
