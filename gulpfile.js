'use strict';
//此处代码都是由NODE执行
//载入gulp模块
var gulp=require('gulp');
var browserSync = require('browser-sync');

var less=require('gulp-less');   //载入gulp-less包
//var cssnano=require('gulp-cssnano');  //载入gulp-cssnano包
//将.less文件编译成.css文件 
const postcss=require('gulp-postcss');
const autoprefixer=require('autoprefixer');

gulp.task('css',function(){
    var plugins = [
        autoprefixer({browsers: ['last 1 version']})
    ]; 
    gulp.src('./dist/css/*.css')
    .pipe(less())  //less语法编译
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./dist/css'))
    //改变后刷新
    .pipe(browserSync.reload({stream:true}));
   
});
gulp.task('html',function(){
    gulp.src('./dist/*.html')
    //改变后刷新
    .pipe(browserSync.reload({stream:true}));
});
// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
    gulp.watch('./dist/css/*.css',['css']);
    gulp.watch('./dist/*.html',['html']);
});