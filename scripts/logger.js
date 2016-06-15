#!/usr/bin/env node

var fs = require("fs-extra"),
    path = require("path")
;

var configMap = {
    pathRoot: "/mnt/pub/misc/monitor/"
},
categoryMap = {
    systemError: {value:100, prefix: "system_error_", icon: ":fire:"},
    systemInfo : {value:101, prefix: "system_info_",  icon: ":ok:"},
    appInfo    : {value:201, prefix: "app_info_",     icon: ""}
},
getFileName, getCategoryObjFromCategory, getCategoryObjFromFilepath
;


module.exports = {
    log: function(category, msg) {
        var filePath = getFileName(category);
        fs.appendFile(filePath, msg);
    },

    parse: function(filePath) {
        return getCategoryObjFromFilepath(filePath);
    },
    
    categorySystemError: categoryMap.systemError.value,
    categorySystemInfo : categoryMap.systemInfo.value,
    categoryAppInfo    : categoryMap.appInfo.value,
}


getCategoryObjFromFilepath = function(filePath) {
    var file = path.basename(filePath),
        result = undefined;
    
    Object.keys(categoryMap).forEach(function(key) {
        var aCategory = this[key];
        if(file.startsWith(aCategory.prefix)) {
            result = aCategory;
        }
    }, categoryMap);
    return result;
}


getCategoryObjFromCategory = function(category) {
    var result = undefined;
    Object.keys(categoryMap).forEach(function(key) {
        var aCategory = this[key];
        if(category == aCategory.value) {
            result = aCategory;
        }
    }, categoryMap);
    return result;
}


getFileName = function(category) {
    var epoch = (new Date()).getTime();
    var categoryObj = getCategoryObjFromCategory(category);

    if(categoryObj) {
        return configMap.pathRoot + categoryObj.prefix + epoch;
    }else{
        return configMap.pathRoot + 'undefined_category_' + epoch;
    }
};
