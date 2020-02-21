const gulp = require('gulp');
const webpack = require('webpack-stream');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const browserify = require('browserify');
const es = require('event-stream')
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

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

// gulp.task('bundling', async () => {
//   let files = [
//     './src/controllers/hazards.ts'
//   ]
//   let tasks = files.map((entry) =>{
//     return browserify({entries: [entry]})
//     .plugin(tsify)
//     .bundle()
//     .pipe(source(entry))
//     .pipe(rename({
//       extname: '.bundle.js'
//     }))
//     .pipe(gulp.dest('dist'))
//   });

//   return es.merge.apply(null, tasks);
// });

gulp.task('default', gulp.parallel('watch', 'assets'));