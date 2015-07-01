var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('vendor', function() {
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('vendor.js'))
        //.pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('main', function() {
    gulp.src([
            'js/leap-extras.js',
            'js/marionette-drawer.js',
            'js/app.js'
        ])
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('cp', function() {
    gulp.src(['models/*.json']).pipe(gulp.dest('dist/models'));
    gulp.src(['images/*.png']).pipe(gulp.dest('dist/images'));
    gulp.src(['sounds/*.mp3']).pipe(gulp.dest('dist/sounds'));
});

gulp.task('css', function() {
    gulp.src(['css/site.css'])
        .pipe(plugins.concat('style.css'))
        //.pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('replace', function() {
  gulp.src('index.html')
    .pipe(htmlreplace({
        'css': 'css/style.min.css',
        'js': ['js/vendor.min.js', 'js/main.min.js']
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('js', ['vendor', 'main']);

gulp.task('default', ['js', 'css', 'replace', 'cp']);