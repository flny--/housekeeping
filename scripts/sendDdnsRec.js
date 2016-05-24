#!/usr/bin/env node

var ExtIP = require('external-ip'),
    Route53 = require('nice-route53')
;

var configMap = {
        zoneId  : process.env.ROUTE53_ZONE_ID,
        iam_key : process.env.IAM_DDNS_KEY,
        iam_sec : process.env.IAM_DDNS_SECRET,
    },
    getIP = new ExtIP(),
    r53 = new Route53(
        {accessKeyId :     configMap.iam_key,
         secretAccessKey : configMap.iam_sec}
        ),
    onReceiveIp, sendRecord
;


sendRecord = function(ip) {
    var aRec = {
        zoneId : configMap.zoneId,
        name   : 'achn.flny.ch.',
        type   : 'A',
        ttl    : 3600,
        values : [ip]
    };
    console.log(aRec);
    r53.setRecord(aRec, function(err, res) {
        if(err) throw err;
        console.log(res);
    });
    
};


onReceiveIp = function(err, ip) {
    if(err) {
        throw err;
    }
    console.log(ip);
    sendRecord(ip)
}


getIP(onReceiveIp);

