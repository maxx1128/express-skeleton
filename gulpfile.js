var gulp          = require('gulp');  
var p             = require('gulp-load-plugins')();
var gutil         = require('gulp-util');

var fs          = require('fs'),
    del         = require('del'),
    babelify    = require('babelify')
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    scsslint    = require('gulp-scss-lint'),
    glob        = require('glob'),
    es          = require('event-stream'),
    exec        = require('child_process').exec
;

// Important variables used throughout the gulp file //

// Configurations for different file paths
var config = {}

// Set to true if in production. Files will go to the 'app' folder.
// Set to false if launching. Files will go to the 'dist' folder, clean and ready
var prod = true;

// Find errors!
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}

// Function for plumber to handle errors
function customPlumber(errTitle) {
    return p.plumber({
        errorHandler: p.notify.onError({
            // Custom error titles go here
            title: errTitle || 'Error running Gulp',
            message: "<%= error.message %>",
            sound: 'Submarine',
        })
    });
}

// Browser Sync settings and config
var bs_reload = {
    stream: true
};

gulp.task('browserSync', function() {
    var Settings = {
        files: ['test/**'],
        port: 4000,
        server: { baseDir: 'test' },
        reload: ({ stream: true}),
        notify: false
    };

    browserSync(Settings)
});



gulp.task('browserify', function(done) {
  glob('_javascript/main-**.js', function(err, files) {
    if(err) done(err);

    var tasks = files.map(function(entry) {
      return browserify({
          entries: [entry],
          outputStyle: 'compressed'
        })
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source(entry))
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.reload(bs_reload))
      });
    es.merge(tasks).on('end', done);
  })
});

gulp.task('browserify-cleanup', function() {

  return gulp
    .src('assets/js/_javascript/*.js')
    .pipe(gulp.dest('assets/js'))
});

gulp.task('browserify-delete', function(cb) {
  del(['assets/js/_javascript'], cb);
});

gulp.task('browserify-full', function(cb) {
  runSequence(
    ['browserify'],
    ['browserify-cleanup'],
    ['browserify-delete'],
    cb
  )
});



// Converts the Sass partials into a single CSS file
gulp.task('sass', function () {
    
    // Sass and styling variables
    var sassInput = '_sass/main.scss';
    var sassOptions = { 
        outputStyle: 'expanded'
    };

  return gulp
    .src(sassInput)
    .pipe(customPlumber('Error running Sass'))

    // Write Sass for either dev or prod
    .pipe(p.sass(sassOptions))

    .pipe(p.rename("style.css"))
    // Sends the Sass file to either the app or dist folder
    .pipe(gulp.dest('assets/css'))
    .pipe(p.notify({ message: 'Sass Processed!', onLast: true }))
    .pipe(browserSync.reload(bs_reload))
});

// For linting the Sass files
gulp.task('scss-lint', function() {
  return gulp.src([
      '_sass/**/**/**/*.scss',
      '!_sass/_generic/_normalize.scss',
      '!_sass/_tools/_synapse.scss'
    ])
    .pipe(scsslint({
      'maxBuffer': 9999999999999999999999999999999999999999,
      'config': '_sass/.css-guidelines.yml'
    }))
});


// Task to watch the things!
gulp.task('watch', function(){
  gulp.watch('_sass/**/**/*.scss', ['sass']);
  gulp.watch('_javascript/**/**/*.js', ['browserify']);
});





// start our server and listen for changes
gulp.task('server', function() {
    // configure nodemon
    p.nodemon({
        // the script to run the app
        script: 'index.js',
        // this listens to changes in any of these files/routes and restarts the application
        watch: ["index.js", "views/**/**/*", 'assets/**/**/*'],
        ext: 'js liquid css'
        // Below i'm using es6 arrow functions but you can remove the arrow and have it a normal .on('restart', function() { // then place your stuff in here }
    }).on('restart', () => {
    gulp.src('index.js')
      // I've added notify, which displays a message on restart. Was more for me to test so you can remove this
      .pipe(p.notify('Restarting server'));
  });
});

function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}

gulp.task('nodemon-babel', runCommand('nodemon --exec npm run babel-node -- index.js'));

// Tasks that run multiple other tasks, including default //

gulp.task('default', function(callback) {
  runSequence(
    ['browserify-full', 'sass'],
    ['watch', 'nodemon-babel'],
    callback
  )
});
