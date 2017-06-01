'use strict';
//此处代码都是由NODE执行
//载入gulp模块
var gulp=require('gulp');
var browserSync = require('browser-sync');
// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
    
});