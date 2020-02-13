const gulp = require('gulp');
const webpack = require('webpack-stream');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

/*
In Gulp v4 the list parameter has been deprecated. Must
use gulp.series() or gulp.parallel()...
*/

gulp.task('running', () => {
  console.log('gulp running...');
});

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', gulp.series('scripts', () => {
  gulp.watch('src/**/*.ts', gulp.series('scripts'));
}));

gulp.task('assets', () => {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('watch', 'assets'));