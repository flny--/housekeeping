var AWS = require('aws-sdk'),
    SlackNode = require('slack-node')
;

var configMap = {
  region  : 'us-west-2',
  fname   : 'arn:aws:lambda:us-west-2:209956794958:function:checkHeartbeat',
  qurl    : 'https://sqs.us-west-2.amazonaws.com/209956794958/heartbeat',
},
init, queue, slack, lambda,
receiveBeat, warnToSlack;


init = function(context) {
  lambda = new AWS.Lambda();
  lambda.getFunctionConfiguration({FunctionName: configMap.fname},
                                              function(err, data) {
    if(err) {
      console.log(err);
      return;
    }
    var fParams = JSON.parse(data.Description);
    queue = new AWS.SQS({params: {QueueUrl: configMap.qurl}});
    slack = new SlackNode();
    slack.setWebhook(fParams.webhook);
    
    receiveBeat(context);
  });
}



receiveBeat = function(context) {
  console.log('try to receive message...');
  queue.receiveMessage(function(err, data) {
    if(err) {
      console.log(err);
      warnToSlack(context);
    }else if(!data.Messages){
      console.log('queue is empty.');
      warnToSlack(context);
    }else{
      console.log('succeed.');
      context.succeed('サーバが稼動しています');
    }
  })
}

warnToSlack = function(context) {
  slack.webhook(
    {icon_emoji : ':fire:',
     text       : 'サーバが停止しています'},
    function(err, res) {
      if(err) {
        console.log(err);
        context.succeed(err);
      }else{
        console.log(res);
        context.succeed(res);
      }
    }
  )
}


exports.handler = function(event, context) {
  init(context);

}

