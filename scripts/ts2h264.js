#!/usr/bin/env node

var ffmpeg = require("fluent-ffmpeg"),
    fs = require("fs-extra"),
    path = require("path")
;

// var tsRoot = "/mnt/pub/movie/tv/raw/";
var configMap = {
        pathList:[
            {src: '/mnt/pub/movie/tv/raw/ひつじのショーン/',
             dst: '/mnt/pub/movie/tv/encoded/ひつじのショーン/'},
        ]
        
    },
    encode, onSuccess, onError
;




encode = function(srcPath, dstPath) {
    console.log(srcPath + ' to ' + dstPath);
    ffmpeg()
      .input(srcPath)
      .audioCodec('libmp3lame')
      .audioBitrate(192)
      .videoCodec('libx264')
      .addOptions(['-crf 20'])
      .on('end', onSuccess)
      .on('error', onError)
      .outputOptions(['-y'])
      .saveToFile(dstPath);
};

onSuccess = function(stdout, stderr) {
    console.log(stdout);
};

onError = function(err) {
    console.log(err.message);
};


configMap.pathList.forEach(function(pathArray) {
    var tsDir = pathArray.src,
        mp4Dir = pathArray.dst,
        tsDirStat = fs.statSync(tsDir)
    ;
    fs.ensureDirSync(mp4Dir);
    fs.chownSync(mp4Dir, tsDirStat.uid, tsDirStat.gid);
    
    fs.readdirSync(tsDir, function(err, files) {
        var tsPath, mp4Path, fileStat;
    
        if(err) throw err;
    
        files.filter(function(file) {
            tsPath = tsDir + file;
            mp4Path = mp4Dir + path.basename(file, '.ts') + '.mp4';
            fileStat = fs.statSync(tsPath);
            if(fileStat.isFile()) {
                encode(tsPath, mp4Path);
                
                fs.chownSync(mp4Path, fileStat.uid, fileStat.gid);
            }
        })
    })
})

