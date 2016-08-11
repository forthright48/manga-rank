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
const resolveDependencies = require('gulp-resolve-dependencies');
const globToVinyl = require('glob-to-vinyl');
const pathModule = require('path');

const path = {
  dirs: {
    public: './public',
    temp: './temp'
  },
  pug: './views/**/*.pug',
  images: './src/**/*.{JPG,jpg,png,gif}',
  css: [
    './src/**/*.css',
    './node_modules/@forthright48/simplecss/src/*.css'
  ],
  js: './src/**/*.js',
  json: 'src/**/*.json',
  vendor: {
    components: {
      all: 'src/**/vendor/**/*.*',
      js: 'src/**/vendor/**/*.js',
      nonJs: [
        'app/**/vendor/**/*',
        '!app/**/vendor/**/*.js'
      ]
    }
  },
  browsersync: ['./public/**/*.css', './public/**/*.js']
};

gulp.task('style', function() {
  return gulp.src(path.css)
    .pipe(cleanCSS())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('clean', function(cb) {
  return del([path.dirs.public, path.dirs.temp], cb);
});

let dependencyCounter;

function solveDependency(file, len, done) {
  const relative = pathModule.relative(pathModule.join(__dirname, 'src'), file);
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
  globToVinyl(path.js, function(err, files) {
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
    del([path.dirs.temp], done);
  });
}));

gulp.task('reload', function() {
  return browsersync.reload;
});

gulp.task('watch:css', function() {
  return gulp.watch(path.css, gulp.series('style'));
});
gulp.task('watch:js', function() {
  return gulp.watch(path.js, gulp.series('script'));
});

gulp.task('watch', gulp.parallel('watch:css', 'watch:js'));

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


gulp.task('browser-sync', gulp.series('nodemon', function() {
  return browsersync.init({
    proxy: 'http://localhost:8002',
    files: path.browsersync
  });
}));

gulp.task('default', gulp.series('clean', 'style', 'script', 'browser-sync', 'watch', function(done) {
  done();
}));

gulp.task('default',
  gulp.series(
    'clean',
    gulp.parallel(
      'style', 'script'
    ),
    gulp.parallel('watch', 'browser-sync')
  )
);
