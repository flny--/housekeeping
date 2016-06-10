#!/usr/bin/env node

var ExtIP = require('external-ip'),
    Route53 = require('nice-route53'),
    fs = require("fs"),
    logger = require("./logger")
;

var configMap = {
        zoneId  : process.env.ROUTE53_ZONE_ID,
        iam_key : process.env.IAM_DDNS_KEY,
        iam_sec : process.env.IAM_DDNS_SECRET,
        prevIpPath : "/mnt/pub/misc/monitor/prevIp"
    },
    getIP = new ExtIP(),
    r53 = new Route53(
        {accessKeyId :     configMap.iam_key,
         secretAccessKey : configMap.iam_sec}
        ),
    onReceiveIp, sendRecord, hasChangedIp;
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
        fs.writeFileSync(configMap.prevIpPath, ip, 'utf8');
        logger.log(logger.categorySystemInfo, ip + " : External Ip Changed.");
    });
    
};


hasChangedIp = function(nowIp) {

    var prevIp;
    try {
        prevIp = fs.readFileSync(configMap.prevIpPath, 'utf8');
    }catch(err){
        return true;
    }
    if(prevIp) {
        return prevIp != nowIp;
    }else{
        return true;
    }
}


onReceiveIp = function(err, ip) {
    if(err) throw err;

    if(hasChangedIp(ip)) {
        sendRecord(ip)
    }else{
        console.log("External Ip not changed.");
    }
}


getIP(onReceiveIp);

