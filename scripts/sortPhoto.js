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
    exif(file, function(err, exifObj){
        if(err) throw err;
        console.log(exifObj.DateTimeOriginal);
    });
};



readdir(configMap.poolPath, ["*.3gp*", "*.mp4"], function(err, files) {
    if(err) throw err;
    files.forEach(sortOneFile);
});
