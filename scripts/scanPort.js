#!/usr/bin/env node

var scanner = require('node-netcat').portscan(),
    logger = require('./logger')
;


var configMap = {
  host  :'pfm.flny.ch',
  ports : ['43021', '53', '445', '8200', '8201'],
  udpErrorStr : 'protocol \"udp\" with message',
  msgPath : '/mnt/pub/misc/monitor/'
},
errMessages,
scanPorts
;


scanPorts = function() {
  var messages = '';
  configMap.ports.forEach(function(port) {
    scanner.run(configMap.host, port, function(err, res) {
      if(err && err.indexOf(configMap.udpErrorStr) == -1) {
        messages += err + '\n';
      }
    });
  });
  return messages;
}


errMessages = scanPorts();
if(errMessages == '') {
  console.log(errMessages);
  logger.log(logger.categorySystemError, errMessages);
}

