'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const newer = require('gulp-newer');
const browser = require('browser-sync').create();
const notify = require('gulp-notify');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');


gulp.task('sass', function(){
	return gulp.src('app/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.on('error', notify.onError(function(err){
			return {
				title:'sass',
				message:err.message,
			}
		}))
		.pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest('public'))
});

gulp.task('del', function(){
	return del('public');
})

gulp.task('assets', function(){
	return gulp.src('app/assets/**', {since: gulp.lastRun('assets')})
		.pipe(newer('public'))
		.pipe(gulp.dest('public'));
})

gulp.task('tpl', function(){
	return gulp.src('app/templates/**/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('public'))
})

gulp.task('build', gulp.series('del', gulp.parallel('sass','assets')));

gulp.task('watch', function(){
	gulp.watch('app/css/*.*', gulp.series('sass'));
	gulp.watch('app/assets/*', gulp.series('assets')).on('unlink', function(filepath){
		console.log('delete', filepath);
	});
	gulp.watch('app/teplates/index.html');
})

gulp.task('serve', function(){
	browser.init({
		server:'public',
	});
	browser.watch('public/**/*.*').on('change', browser.reload);
})

gulp.task('dev', gulp.series(gulp.parallel('build','tpl'), gulp.parallel('watch', 'serve')));

