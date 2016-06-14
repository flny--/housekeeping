#!/usr/bin/env node

var readdir = require("recursive-readdir"),
    path    = require("path"),
    fs      = require("fs-extra"),
    exif    = require("exif")
;

var configMap = {
        poolPath   : "/mnt/pub/image/photo/pool/",
        targetPath : "/mnt/pub/image/photo/"

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
        console.log(year + month);
    });
};



readdir(configMap.poolPath, function(err, files) {
    if(err) throw err;
    files.forEach(sortOneFile);
});
