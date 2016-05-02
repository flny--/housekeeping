#!/usr/bin/env node

var ffmpeg = require("fluent-ffmpeg"),
    fs = require("fs-extra")
;

// var tsRoot = "/mnt/pub/movie/tv/raw/";
var tsDir = process.argv[2],
    mp4Dir = process.argv[3]
;

var encode, onSuccess, onError
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


fs.readdir(tsDir, function(err, files) {
    if(err) throw err;
    files.filter(function(file) {
        if(fs.statSync(tsDir + file).isFile()) {
            console.log(tsDir + file);
        }
    })
})
