# gulp-demo
gulp 小demo   整合了 压缩 css、压缩js、压缩html、 并生成版本号

1.首先安装好 node   这个在这里就不写啦

2.在你要运行的文件夹下面建一个gulpfile.js

我的gulpfile.js  内容如下

var gulp = require("gulp");

var minifycss = require("gulp-minify-css");

var gulpif = require("gulp-if");

var minifyHtml = require("gulp-minify-html");

var del = require("del");

var browserSyn = require("browser-sync");

var through = require("through2");

var rename = require('gulp-rename');

var $ = require('gulp-load-plugins')();

//将html 文件压缩  输出到指定文件夹下  将生成带版本号的css  和js 文件名 也整合到 相应的html 文件里  （我是这样理解的）

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

//压缩css  输出到指定文件夹  并生成一个带版本号的json 文件  在上面的那一段代码中读取

gulp.task('minifycss',['clean'],function(){
	return gulp.src("./src/css/*.css")
		.pipe($.rev())
		.pipe(minifycss())
		.pipe(gulp.dest('./dist/css'))
		.pipe($.rev.manifest())
		.pipe(gulp.dest('./src/rev/css'))
});

//压缩js 输出到指定文件夹 并生成一个带版本号的json 文件  在第一段代码中读取

gulp.task('minifyjs',['clean'],function(){
	return gulp.src("./src/js/*.js")
		.pipe($.uglify())
		.pipe($.rev())
		.pipe(gulp.dest("./dist/js"))
		.pipe($.rev.manifest())
		.pipe(gulp.dest('./src/rev/js'))
});

//执行任务之前先把 指定文件夹下的内容清除

gulp.task("clean",function(cb){
	return del(['./dist/js','./dist/css'],cb)
});

//监听任务  监听指定文件夹下的 所有文件  如果有改变 

gulp.task("watch",function(){
	var watcher =gulp.watch('./src/**/*');
	return watcher.on('change',function(event){
		console.log('event type:'+event.type);
		console.log('event path:'+event.path);
	})
});

//默认任务  依赖于watch 任务  

gulp.task('default',['watch'],function(){
	gulp.start('srctisk','minifycss','minifyjs');
});
