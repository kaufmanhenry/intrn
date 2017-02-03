var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('build-sass', function () {
    return gulp.src(['app/frontend/components/**/*.scss', 'scss/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('sass.build.css'))
        .pipe(gulp.dest('./app/frontend/css'));
});

gulp.task('watch-sass', function () {
    gulp.watch(['**/*.scss', './app/frontend/components/**/*.scss'], ['build-sass']);
});