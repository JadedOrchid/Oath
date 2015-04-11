var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;
//adding the following:
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

var paths = {
  scripts: ['./client/app/www/js/**/*.js', 
            './server/api/*.js', 
            './server/auth/*.js', 
            './server/config/*.js',
            './server/models/*.js',
            './server/server.js'],
  css: ['./client/app/www/css/style.css'],
  html: ['/.client/app/www/templates/', './client/app/www/index.html'],
  images: ['./client/app/www/img/**/*.png', 
      './client/app/www/img/**/*.jpg', 
      './client/app/www/img/**/*.gif']
};

gulp.task('default');

// // Lint Task
// gulp.task('lint', function() {
//     return gulp.src(paths.scripts)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

gulp.task('scripts', function() {
 gulp.src(paths.scripts)
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(uglify())
 .pipe(concat('app.min.js'))
 .pipe(gulp.dest(bases.dist + 'scripts/'));
});


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

/**
* Test task, run test once and exit
*/
gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/tests/my.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});