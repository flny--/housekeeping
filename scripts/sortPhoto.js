#!/usr/bin/env node

var readdir = require("recursive-readdir"),
    path    = require("path"),
    fs      = require("fs-extra"),
    exif    = require("exif"),
    logger  = require("./logger")
;

var configMap = {
        poolPath   : "/mnt/pub/image/photo/pool/",
        targetRoot : "/mnt/pub/image/photo/",
        donePath   : "/mnt/pub/misc/done/"
    },
    fileCount = 0, sortedCount = 0,
    sortOneFile
;


sortOneFile = function(file) {

    exif(file, function(err, exifObj){
        if(err) {
            console.log(err);
            fileCount--;
            return;
        }
        var tokens = 
            String(exifObj.exif.DateTimeOriginal).replace(/ /g, ':').split(':');
        var year  = tokens[0],
            month = tokens[1];
        var targetPath = configMap.targetRoot + year + '/' + month + '/';
        fs.ensureDirSync(targetPath);
        
        var prefix = String(exifObj.image.Model).substr(0, 3) + '_';
        var targetFile = targetPath + prefix + path.basename(file);

        fs.rename(file, targetFile, function(err) {
            if(err) {
                console.log(err);
            }else{
                sortedCount++;
                console.log(targetFile);
            }
            fileCount--;
            if(fileCount === 0 && sortedCount > 0) {
                logger.log(logger.categoryappInfo, 
                    sortedCount + "枚の写真をアップロードしました");
            }
        });
        
    });
};



readdir(configMap.poolPath, function(err, files) {
    if(err) throw err;
    var filtered = files.filter(function(file) {
        return path.basename(file).toLowerCase().endsWith(".jpg");
    });
    fileCount = filtered.length;
    filtered.forEach(sortOneFile);
});
