#!/usr/bin/env node

var ffmpeg = require("fluent-ffmpeg");
var fs = require("fs-extra");

var tsRoot = "/mnt/pub/movie/tv/raw/";



fs.readdir(tsRoot, function(err, files) {
    if(err) throw err;
    files.filter(function(file) {
        if(fs.statSync(tsRoot + file).isDirectory()) {
            console.log(tsRoot + file);
        }
    })
})