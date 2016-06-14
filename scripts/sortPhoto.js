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
        if(err) {
            console.log(err);
            return;
        }
        var tokens = String(exifObj.exif.DateTimeOriginal).replace(/ /g, ':').split(':');
        var year  = tokens[0],
            month = tokens[1];
        var targetPath = configMap.targetRoot + year + '/' + month + '/';
        fs.ensureDirSync(targetPath);
        
        var targetFile = targetPath + path.basename(file);
        console.log(exifObj.exif);
        /*
        fs.rename(file, targetFile, function(err) {
            if(err) {
                console.log(err);
                return;
            }else{
                console.log(targetFile);
            }
        });
        */
    });
};



readdir(configMap.poolPath, function(err, files) {
    if(err) throw err;
    files.forEach(sortOneFile);
});
