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
        [accessKeyId:     configMap.iam_key,
         secretAccessKey: configMap.iam_sec]
        ),
    onReceiveIp, sendRecord
;


sendRecord = function(ip) {
    r53.records(configMap.zoneId, function(err, recs) {
        console.log(recs);
        if(err) throw err;
        
        var aRec = recs.filter(function(record, index, array){
            console.log(record);
            return (record.name == 'flny.ch.' && record.type == 'A');
        })[0];
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

