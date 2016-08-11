const gulp = require('gulp');

require('./gulp/server.js')(gulp);
require('./gulp/util.js')(gulp);
require('./gulp/style.js')(gulp);
require('./gulp/script.js')(gulp);
require('./gulp/watch.js')(gulp);


gulp.task('default',
  gulp.series(
    'clean',
    gulp.parallel('style', 'script'),
    gulp.parallel('watch', 'browser-sync')
  )
);
