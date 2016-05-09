#!/usr/bin/env node

var ffmpeg = require("fluent-ffmpeg"),
    fs = require("fs-extra"),
    path = require("path")
;

// var tsRoot = "/mnt/pub/movie/tv/raw/";
var configMap = {
        pathList:[
            {src: '/mnt/pub/movie/tv/raw/ひつじのショーン/',
             dst: '/mnt/pub/movie/tv/enc/ひつじのショーン/'},
            {src: '/mnt/pub/movie/tv/raw/ちいさなプリンセスソフィア/',
             dst: '/mnt/pub/movie/tv/enc/ちいさなプリンセスソフィア/'},
        ],
        uid: 1000,
        gid: 1000,
    },
    encList = [],
    encNow,
    encode, onSuccess, onError, doNext
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
    doNext();
};

onError = function(err) {
    console.log(err.message);
    console.log(encNow.dst + ' failed.');
};

doNext = function() {
    if(encNow) {
        console.log(encNow.dst + ' encoded.');
        fs.chownSync(encNow.dst, configMap.uid, configMap.gid);
    }
    encNow = encList.shift();
    if(encNow) {
        encode(encNow.src, encNow.dst);
    }
}


configMap.pathList.forEach(function(pathArray) {
    var tsDir = pathArray.src,
        mp4Dir = pathArray.dst
    ;

    fs.ensureDirSync(mp4Dir);
    fs.chownSync(mp4Dir, configMap.uid, configMap.gid);

    console.log(tsDir + ' reading...');
    var files = fs.readdirSync(tsDir);
    var tsPath, mp4Path, fileStat;

    files.filter(function(file) {
        tsPath = tsDir + file;
        mp4Path = mp4Dir + path.basename(file, '.ts') + '.mp4';
        fileStat = fs.statSync(tsPath);
        if(fileStat.isFile()) {
            encList.push({src:tsPath, dst:mp4Path});
        }
    })
})
doNext();

