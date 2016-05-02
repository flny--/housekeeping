#!/usr/bin/env node

var msgPath = "/mnt/pub/misc/monitor/"
var donePath = "/mnt/pub/misc/monitor/done/"
var filePrefix = "system_port_"

var SlackNode = require('slack-node');
var slack = new SlackNode();
slack.setWebhook(process.env.WEBHOOK_URI);
var fs = require('fs');

fs.readdir(msgPath, function(err, files) {
  if(err) throw err;
  files.filter(function(file) {
    return fs.statSync(msgPath + file).isFile() && 
             file.startsWith(filePrefix);
  }).forEach(function (file) {
    fs.readFile(msgPath + file, 'utf8', function(err, data) {
      if(err) {
        throw err;
      }else{
        slack.webhook({
          icon_emoji: ":warning:",
          text: data
        }, function(err, res) {
          if(err) {
            throw err;
          }else{
            console.log(res);
            fs.renameSync(msgPath + file, donePath + file);
          }
        })
      }
    })
  })
});

