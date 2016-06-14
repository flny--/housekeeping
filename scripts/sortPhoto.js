#!/usr/bin/env node

var readdir = require("recursive-readdir"),
    path    = require("path"),
    fs      = require("fs-extra"),
    exif    = require("exif")
;

var configMap = {
        poolPath   : "/mnt/pub/image/photo/pool/",
        targetRoot : "/mnt/pub/image/photo/",
        donePath   : "/mnt/pub/misc/done/"
    },
    filterFile, sortOneFile
;


filterFile = function(file, stats) {
    if(path.basename(file).toLowerCase().endsWith(".jpg")) {
        return false;
    }else{
        return true;
    }
};


sortOneFile = function(file) {
    if(!path.basename(file).toLowerCase().endsWith(".jpg")) {
        return;
    }
    exif(file, function(err, exifObj){
        if(err) throw err;
        var tokens = String(exifObj.exif.DateTimeOriginal).replace(/ /g, ':').split(':');
        var year  = tokens[0],
            month = tokens[1];
        var targetPath = configMap.targetRoot + year + '/' + month;
        console.log(targetPath);
        fs.ensureDirSync(targetPath);
    });
};



readdir(configMap.poolPath, function(err, files) {
    if(err) throw err;
    files.forEach(sortOneFile);
});
