#!/usr/bin/env node

var ffmpeg = require("fluent-ffmpeg"),
    fs = require("fs-extra")
;

// var tsRoot = "/mnt/pub/movie/tv/raw/";
var tsDir = process.argv[2],
    mp4Dir = process.argv[3]
;


var encode = function(srcPath, dstPath) {
    ffmpeg()
      .input(srcPath)
      .audioCodec('libmp3lame')
      .audioBitrate(192)
      .videoCodec('libx264')
      .addOptions(['-crf 20'])
};


fs.readdir(tsDir, function(err, files) {
    if(err) throw err;
    files.filter(function(file) {
        if(fs.statSync(tsDir + file).isDirectory()) {
            console.log(tsDir + file);
        }
    })
})
