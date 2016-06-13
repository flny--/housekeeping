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
    return false;
    if(stats.isDirectory()) {
        return true;
    }else if(path.basename(file).toLowerCase().endsWith(".jpg")) {
        return false;
    }else{
        return true;
    }
};


sortOneFile = function(file) {
    console.log(file);
/*    exif(file, function(err, exifObj){
        if(err) throw err;
        console.log(file + exifObj);
    });*/
};



readdir(configMap.poolPath, [filterFile], function(err, files) {
    if(err) throw err;
    files.forEach(sortOneFile);
});
