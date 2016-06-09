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
errMessages = '',
scanPortChain,
scanNext
;


scanPortChain = function(port) {
  scanner.run(configMap.host, port, function(err, res) {
    if(err && err.indexOf(configMap.udpErrorStr) == -1) {
      errMessages += err + '\n';
    }
    scanNext();
  });
}

scanNext = function() {
  var port = configMap.ports.shift();
  if(port) {
    scanPortChain(port);
  }else{
    if(errMessages != '') {
      console.log(errMessages);
      logger.log(logger.categorySystemError, errMessages);
    };
  }
}



console.log(configMap.ports + ' checking...');
scanNext();

