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
            'js/event-listener.js',
            'js/frame-processor.js',
            'js/leap-listener.js',
            'js/marionette-drawer.js',
            'js/puppet.js',
            'js/app.js'
        ])
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
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
        'css': '/dist/css/style.min.css',
        'js': ['/dist/js/vendor.min.js', '/dist/js/main.min.js']
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('js', ['vendor', 'main']);

gulp.task('default', ['js', 'css', 'replace']);