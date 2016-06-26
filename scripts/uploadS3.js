#!/usr/bin/env node

var readdir = require("recursive-readdir"),
    path    = require("path"),
    fs      = require("fs-extra"),
    logger  = require("./logger")
;


var configMap = {
        upPath   : "/mnt/pub/misc/s3/",
        donePath   : "/mnt/pub/misc/done/",
        uid        : 1000,
        gid        : 1000,
    },
    fileCount = 0, sortedCount = 0, dupedCount = 0,
    sortOneFile, changeAuth;
;

