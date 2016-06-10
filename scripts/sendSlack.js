#!/usr/bin/env node


var SlackNode = require('slack-node'),
    slack = new SlackNode(),
    fs = require('fs'),
    logger = require('./logger');
;

var configMap = {
  msgPath : "/mnt/pub/misc/monitor/",
  donePath : "/mnt/pub/misc/monitor/done/",
}
;


slack.setWebhook(process.env.WEBHOOK_URI);



fs.readdir(configMap.msgPath, function(err, files) {
  if(err) throw err;
  files.filter(function(file) {
    return fs.statSync(configMap.msgPath + file).isFile();
  }).forEach(function (file) {
    var logCategory = logger.parse(file);
    if(!logCategory) {
      return;
    }
    fs.readFile(configMap.msgPath + file, 'utf8', function(err, data) {
      if(err) {
        throw err;
      }else{
        slack.webhook({
          icon_emoji: logCategory.icon,
          text: data
        }, function(err, res) {
          if(err) {
            throw err;
          }else{
            console.log(res);
            fs.renameSync(configMap.msgPath + file, configMap.donePath + file);
          }
        })
      }
    })
  })
});

