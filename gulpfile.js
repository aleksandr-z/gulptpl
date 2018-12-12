'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function(){
	return gulp.src('app/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public'))
});

gulp.task('del', function(){
	return del('public');
})

gulp.task('assets', function(){
	return gulp.src('app/assets/**')
		.pipe(gulp.dest('public'));
})

gulp.task('build', gulp.series('del', gulp.parallel('sass','assets')));