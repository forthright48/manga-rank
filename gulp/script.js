const path = require('path');
const pump = require('pump');
const resolveDependencies = require('gulp-resolve-dependencies');
const concat = require('gulp-concat');
const globToVinyl = require('glob-to-vinyl');
const recursive = require('gulp-recursive-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const config = require('./config.js');

module.exports = function(gulp) {
  let dependencyCounter;

  function solveDependency(file, len, done) {
    const relative = path.relative(path.join(__dirname, 'src'), file);
    pump([
      gulp.src(file),
      resolveDependencies({
        pattern: /\* @requires [\s-]*(.*\.js)/g,
        log: true
      }),
      concat(relative),
      gulp.dest('./temp')
    ], function() {
      dependencyCounter++;
      if (dependencyCounter === len) done();
    });
  }

  gulp.task('solveDependency', function(done) {
    dependencyCounter = 0;
    globToVinyl(config.path.js, function(err, files) {
      if (files.length === 0) {
        return done();
      }
      for (const file in files) {
        solveDependency(files[file].path, files.length, done);
      }
    });
  });

  gulp.task('script', gulp.series('solveDependency', function(done) {
    return pump([
      gulp.src('./temp/**/*.js'),
      recursive({
        extname: '.js'
      }),
      babel({
        presets: ['es2015'],
        plugins: ['transform-runtime']
      }),
      uglify(),
      gulp.dest('./public')
    ], function() {
      del([config.path.dirs.temp], done);
    });
  }));
};
