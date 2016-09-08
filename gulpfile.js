var gulp = require("gulp");
var minifycss = require("gulp-minify-css");
var gulpif = require("gulp-if");
var minifyHtml = require("gulp-minify-html");
var del = require("del");
var browserSyn = require("browser-sync");
var through = require("through2");
var rename = require('gulp-rename');
var $ = require('gulp-load-plugins')();

gulp.task('srctisk',function () {
	return gulp.src(["./src/rev/**/*.json",'./src/*.html'])
		.pipe($.revCollector())
		.pipe($.minifyHtml(
		{
				empty:true,
				spare:true,
				auotes:true
			}
		))
		.pipe(gulp.dest("./dist"))
});
gulp.task('minifycss',['clean'],function(){
	return gulp.src("./src/css/*.css")
		.pipe($.rev())
		.pipe(minifycss())
		.pipe(gulp.dest('./dist/css'))
		.pipe($.rev.manifest())
		.pipe(gulp.dest('./src/rev/css'))
});
gulp.task('minifyjs',['clean'],function(){
	return gulp.src("./src/js/*.js")
		.pipe($.uglify())
		.pipe($.rev())
		.pipe(gulp.dest("./dist/js"))
		.pipe($.rev.manifest())
		.pipe(gulp.dest('./src/rev/js'))
});
gulp.task("clean",function(cb){
	return del(['./dist/js','./dist/css'],cb)
});
gulp.task("watch",function(){
	var watcher =gulp.watch('./src/**/*');
	return watcher.on('change',function(event){
		console.log('event type:'+event.type);
		console.log('event path:'+event.path);
	})
});

gulp.task('default',['watch'],function(){
	gulp.start('srctisk','minifycss','minifyjs');
});