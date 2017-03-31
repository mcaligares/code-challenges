var gulp = require('gulp');
var yargs = require('yargs');

var enabledLanguages = [
    'javascript'
];

var args = yargs
        .alias('u', 'username').describe('u', 'your username').default('u', 'anonymous')
        .alias('l', 'language').describe('l', 'your language').default('l', 'js')
            .choices('l', enabledLanguages)
        .argv;

gulp.task('default', function() {
    console.log('username:', args.username);
    console.log('language:', args.language);
});
