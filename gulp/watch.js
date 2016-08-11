const config = require('./config.js');

module.exports = function(gulp) {
  gulp.task('watch:css', function() {
    return gulp.watch(config.path.css, gulp.series('style'));
  });
  gulp.task('watch:js', function() {
    return gulp.watch(config.path.js, gulp.series('script'));
  });

  gulp.task('watch', gulp.parallel('watch:css', 'watch:js'));
};
