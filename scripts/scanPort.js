#!/usr/bin/env node

var host = 'pfm.flny.space';
var ports = ['22', '53', '445', '8200', '80'];
var udpErrorStr = 'protocol \"udp\" with message';
var msgPath = "/mnt/pub/misc/monitor/"

var scanner = require('node-netcat').portscan();
var fs = require('fs');

var msgFile = msgPath + "system_port_" + (new Date()).getTime();

ports.forEach(function(port) {
  scanner.run(host, port, function(err, res) {
    if(err && err.indexOf(udpErrorStr) == -1) {
      fs.appendFile(msgFile, err + "\n");
    }
  });
});
