import gulp from 'gulp'
import webserver from 'gulp-webserver'

gulp.task('serve', function () {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      fallback: 'index.html'
    }))
})
