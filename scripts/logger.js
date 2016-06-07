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
getFileName, getCategoryObj
;


module.exports = {
    log: function(category, msg) {
        var filePath = getFileName(category);
        fs.appendFile(filePath, msg);
    },
    
    categorySystemError: categoryMap.systemError.value,
    categorySystemInfo : categoryMap.systemInfo.value,
    categoryappInfo    : categoryMap.appInfo.value,
}



getCategoryObj = function(category) {
    var result = undefined;
    Object.keys(categoryMap).forEach(function(key) {
        var aCategory = this[key];
        if(category == aCategory.value) {
            result = aCategory;
        }
    }, categoryMap);
/*    categoryMap.forEach(function(aCategory) {
        if(category == aCategory.value) {
            result = aCategory;
            return;
        }
    });*/
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
