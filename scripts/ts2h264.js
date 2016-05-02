#!/usr/bin/env node

var ffmpeg = require("fluent-ffmpeg"),
    fs = require("fs-extra"),
    path = require("path")
;

// var tsRoot = "/mnt/pub/movie/tv/raw/";
var configMap = {
        pathList:[
            ['/mnt/pub/movie/tv/raw/ひつじのショーン',
            '/mnt/pub/movie/tv/enc/ひつじのショーン'],
        ]
        
    },
    encode, onSuccess, onError
;



var tsDir = process.argv[2],
    mp4Dir = process.argv[3]
;




encode = function(srcPath, dstPath) {
    ffmpeg()
      .input(srcPath)
      .audioCodec('libmp3lame')
      .audioBitrate(192)
      .videoCodec('libx264')
      .addOptions(['-crf 20'])
      .on('end', onSuccess)
      .on('error', onError)
      .saveToFile(dstPath);
};

onSuccess = function(stdout, stderr) {
    console.log(stdout);
};

onError = function(err) {
    console.log(err.message);
};


configMap.pathList.forEach(function(pathArray) {
    tsDir = pathArray[0];
    mp4Dir = pathArray[1];
    fs.ensureDirSync(mp4Dir);
    fs.readdir(tsDir, function(err, files) {
        var tsPath, mp4Path;
    
        if(err) throw err;
    
        files.filter(function(file) {
            tsPath = tsDir + file;
            mp4Path = mp4Dir + path.basename(file, '.ts') + '.mp4';
            if(fs.statSync(tsPath).isFile()) {
                encode(tsPath, mp4Path);
            }
        })
    })
})

