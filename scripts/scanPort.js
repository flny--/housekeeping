#!/usr/bin/env node

var scanner = require('node-netcat').portscan(),
    fs = require('fs')
;


var configMap = {
  host  :'pfm.flny.space',
  ports : ['43021', '53', '445', '8200', '8201'],
  udpErrorStr : 'protocol \"udp\" with message',
  msgPath : '/mnt/pub/misc/monitor/'
}


var msgFile = configMap.msgPath + "system_port_" + (new Date()).getTime();

configMap.ports.forEach(function(port) {
  scanner.run(configMap.host, port, function(err, res) {
    if(err && err.indexOf(configMap.udpErrorStr) == -1) {
      fs.appendFile(msgFile, err + "\n");
    }
  });
});
