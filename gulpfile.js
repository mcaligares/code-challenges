var fs = require('fs');
var gulp = require('gulp');
var yargs = require('yargs');
var gutil = require('gulp-util');
var copydir = require('copy-dir');
var through = require('through2');
var confirm = require('gulp-confirm');

var settings = JSON.parse(fs.readFileSync('./config/settings.json', 'utf8'));

var args = yargs
        .alias('s', 'skip')
        .alias('i', 'interactive')
        .alias('u', 'username').describe('u', 'your username')
        .alias('l', 'language').describe('l', 'your language')
            .default('l', settings.default.language)//.choices('l', settings.languages)
        .argv;

var username = args.username;
var language = args.language;

var getUserWorkspace = function() {
    return settings.usersPath + '/' + username;
};
var getLanguageWorkspace = function() {
    return settings.templatesPath + '/' + language;
};

gulp.task('default', ['check','intro']);

gulp.task('check', function() {
    if (!fs.existsSync(settings.usersPath)) fs.mkdirSync(settings.usersPath);
    if (!fs.existsSync(settings.templatesPath)) fs.mkdirSync(settings.templatesPath);
    if (!fs.existsSync(settings.challengesPath)) fs.mkdirSync(settings.challengesPath);
});

var showHeader = through.obj(function(chunk, enc, cb) {
    gutil.log(gutil.colors.bold('<CODE> ${CHALLENGES} '));
    cb(null, chunk);
});

var validateArgs = through.obj(function(chunk, enc, cb) {
    if (!username) username = settings.default.username;
    if (settings.languages.indexOf(language) == -1) {
        gutil.log(gutil.colors.red('Lenguaje inválido!'),
                gutil.colors.reset(settings.languages));
        process.exit();
    }
    var templateForLanguagePath = settings.templatesPath + '/' + language;
    if (!fs.existsSync(templateForLanguagePath)) {
        gutil.log(gutil.colors.red('La plantilla para el lenguaje ' + language + ' no existe!'),
                gutil.colors.reset('Anímate y crea una!'));
        process.exit();
    }
    cb(null, chunk);
});

var getLastChallenge = through.obj(function(chunk, enc, cb) {
    var userWorkspace = getUserWorkspace();
    if (!fs.existsSync(userWorkspace)) fs.mkdirSync(userWorkspace);

    var lastChallange = getLastFileModified(fs.readdirSync(settings.challengesPath));
    if (!lastChallange) {
        gutil.log(gutil.colors.red('No tienes retos por ahora.')
                .gutil.colors.reset('Anímate y escribe uno!'));
        process.exit();
    }
    lastChallange.path = userWorkspace + '/' + lastChallange.name;
    cb(null, lastChallange);
});

function getLastFileModified(/*Array*/ files) {
    var resultFile;
    for (var i in files) {
        var filename = files[i];
        var file = fs.statSync(settings.challengesPath + '/' + filename);
        if (!resultFile) {
            resultFile = {name: filename, file: file};
        } else if (resultFile.file.mtime < file.mtime) {
            resultFile = {name: filename, file: file};
        }
    }
    return resultFile;
}

var createChallengeWorkspace = through.obj(function(challenge, enc, cb) {
    var languageWorkspace = getLanguageWorkspace();

    if (!fs.existsSync(challenge.path)) {
        gutil.log(gutil.colors.reset('creando workspace en '), challenge.path);
        fs.mkdirSync(challenge.path);
        copydir.sync(languageWorkspace, challenge.path);
    }
    cb(null, challenge);
});

var ignoreFilesOnWorkspace = through.obj(function(challenge, enc, cb) {
    var gitIgnoreFile = challenge.path + '/.gitignore';
    var ignoredFilesByLanguage = settings.ignoreFiles[language];
    for (var i in ignoredFilesByLanguage) {
        fs.writeFileSync(gitIgnoreFile, ignoredFilesByLanguage[i]);
    }
    cb(null, challenge);
});

var prepareChallenge = through.obj(function(challenge, enc, cb) {
    var challengeFile = settings.challengesPath + '/' + challenge.name;
    var text = fs.readFileSync(challengeFile, {encoding: 'utf-8'});
    gutil.log(gutil.colors.bold('*** ' + challenge.name + ' ***'));
    gutil.log(gutil.colors.reset(text));
    gutil.log('you are ready to work! good luck ' + username +'!');
    cb(null, challenge);
});

gulp.task('intro', function() {
    var userQuest = gutil.colors.reset('Usuario')
        + (username ? gutil.colors.dim(' (' + username + ')') : '');
    var confirmUsername = {
        question: userQuest,
        proceed: function(answer) {
            if (answer) username = answer;
            return true;
        }
    };

    var langQuest = gutil.colors.reset('Lenguaje')
        + (language ? gutil.colors.dim(' (' + language + ')') : '');
    var confirmLanguage = {
        question: langQuest,
        proceed: function(answer) {
            if (answer) language = answer;
            return true;
        }
    };

    return gulp.src(settings.templatesPath)
        .pipe(args.interactive ? showHeader : gutil.noop())
        .pipe(args.interactive ? confirm(confirmUsername) : gutil.noop())
        .pipe(args.interactive ? confirm(confirmLanguage) : gutil.noop())
        .pipe(through.obj(validateArgs))
        .pipe(getLastChallenge)
        .pipe(createChallengeWorkspace)
        .pipe(ignoreFilesOnWorkspace)
        .pipe(prepareChallenge);
});
