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
        ],
        uid: 1000,
        gid: 1000,
    },
    encList = [],
    encNow,
    encode, onSuccess, onError, onStderr
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
      .on('stderr', onStderr)
      .outputOptions(['-y'])
      .saveToFile(dstPath)
      .run();
};

onSuccess = function(stdout, stderr) {
    if(encNow) {
        console.log(encNow.dst + ' encoded.');
    }
    encNow = encList.shift();
    if(encNow) {
        encode(encNow.src, encNow.dst);
    }
};

onError = function(err) {
    console.log(err.message);
    console.log(encNow.dst + ' failed.');
    encNow = encList.shift();
    if(encNow) {
        encode(encNow.src, encNow.dst);
    }
};

onStderr = function(stderrLine) {
    console.log(stderrLine);
};

configMap.pathList.forEach(function(pathArray) {
    var tsDir = pathArray.src,
        mp4Dir = pathArray.dst
    ;
    fs.ensureDirSync(mp4Dir);

    fs.chownSync(mp4Dir, configMap.uid, configMap.gid);
    console.log(mp4Dir + ' owner changed.');
    
    console.log(tsDir + ' reading...');
    var files = fs.readdirSync(tsDir);
    var tsPath, mp4Path, fileStat;

//    console.log(files + ' reading...');

    files.filter(function(file) {
//        console.log(file + ' reading...');
        tsPath = tsDir + file;
        mp4Path = mp4Dir + path.basename(file, '.ts') + '.mp4';
        fileStat = fs.statSync(tsPath);
        if(fileStat.isFile()) {
            encList.push({src:tsPath, dst:mp4Path});
//            encode(tsPath, mp4Path);
            
//            fs.chownSync(mp4Path, fileStat.uid, fileStat.gid);
        }
    })
    console.log(encList);
    onSuccess(null, null);
})

