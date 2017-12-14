var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),  // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     =  require('gulp-cssnano'),
    rename      =  require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require ('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require("gulp-spritesmith");


gulp.task('sass', function (){
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.min.scss', 'app/sass/custom.scss'])
    .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 7', 'ie 8'], {cascade: true}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('scripts', function (){
    return gulp.src([
        'app/libs/jquery/dist/jquery.slim.js', // Берем jQuery
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    ])
        .pipe(concat('libs.min.js')) // Собираемgulp их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('dist/js')); // Выгgulpружаем в папку dist/js
});

gulp.task('sprites', function () {
    return  gulp.src('./app/**/png/*.png')
        .pipe(tasks.spritesmith({
            imgName: 'sprite.png',
            styleName: 'sprite.css',
            imgPath: '../img/sprite.png'
        }))
        .pipe(gulpif('*.png', gulp.dest('./dist/img/')))
        .pipe(gulpif('*.css', gulp.dest('./dist/css/')));
});

gulp.task('css-libs', ['sass'], function (){
    return gulp.src('dist/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));

});

gulp.task('browser-sync',function (){
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});


gulp.task('clean', function(){
    return del.sync('dist');
});

gulp.task('clear', function(){
    return cache.clearAll();
});

gulp.task('img', function (){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlagins: [{removeVeiwBox: false}],
            use: [pngquant()]
        })))
    .pipe (gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs'], function (){
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', ['build-html']);
    gulp.watch('app/js/**/*.js', ['build-js']);
    gulp.watch('app/css/*.css', ['build-css']);
    gulp.watch('dist/*.html', browserSync.reload);
    gulp.watch('dist/css/*.css', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
} );

gulp.task('build', ['clean', 'img', 'sass', 'scripts', 'build-html', 'build-js', 'build-css'], function(){

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

});

gulp.task('build-css', function() {
    var buildCss = gulp.src('app/css/**/*')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build-js', function() {
    var buildjs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build-html', function() {
    var buildhtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build','watch']);