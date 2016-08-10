const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const uglify = require('gulp-uglify');
const pump = require('pump');
const browsersync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const recursive = require('gulp-recursive-concat');
const babel = require('gulp-babel');

gulp.task('style', function() {
  return gulp.src(['./src/**/*.css', './node_modules/@forthright48/simplecss/src/*.css'])
    .pipe(cleanCSS())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('clean', function() {
  return del('./public');
});

gulp.task('script', function(cb) {
  pump([
    gulp.src('./src/**/*.js'),
    recursive({
      extname: '.js'
    }),
    babel({
      presets: ['es2015']
    }),
    uglify(),
    gulp.dest('./public')
  ], cb);
});

gulp.task('reload', browsersync.reload);

gulp.task('watch', function() {
  gulp.watch(['./src/css/*.css', './node_modules/@forthright48/simplecss/src/*.css'], ['style', 'reload']);
  gulp.watch('./src/js/*.js', ['script', 'reload']);
});

gulp.task('browser-sync', ['nodemon'], function() {
  return browsersync.init(null, {
    injectChanges: true,
    proxy: 'http://localhost:8002'
  });
});

gulp.task('nodemon', function(cb) {
  let callbackCalled = false;
  return nodemon({
    script: './index.js'
  }).on('start', function() {
    if (!callbackCalled) {
      callbackCalled = true;
      cb();
    }
  });
});


gulp.task('default', ['clean', 'style', 'script', 'browser-sync', 'watch']);
