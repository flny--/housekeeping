#!/usr/bin/env node

var fs = require("fs-extra")
;

var configMap = {
    pathRoot: "/mnt/pub/misc/monitor/"
},
categoryMap = {
    systemError: {value:100, prefix: "system_error_", icon: ""},
    systemInfo : {value:101, prefix: "system_info_",  icon: ""},
    appInfo    : {value:201, prefix: "app_info_",     icon: ""}
},
log, getFileName, getCategoryObj
;


module.exports = {
    log: log,
    
    categorySystemError: categoryMap.systemError.value,
    categorySystemInfo : categoryMap.systemInfo.value,
    categoryappInfo    : categoryMap.appInfo.value,
}


log = function(category, msg) {
    var filePath = getFileName(category);
    fs.appendFile(filePath, msg);
};


getCategoryObj = function(category) {
    var result = undefined;
    categoryMap.forEach(function(aCategory) {
        if(category == aCategory.value) {
            result = aCategory;
            return;
        }
    });
    return result;
}


getFileName = function(category) {
    var epoch = (new Date()).getTime();
    var categoryObj = getCategoryObj(category);

    if(categoryObj) {
        return configMap.pathRoot + categoryObj.prefix + epoch;
    }else{
        return configMap.pathRoot + 'undefined_category_' + epoch;
    }
};
