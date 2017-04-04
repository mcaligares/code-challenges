var fs = require('fs');
var gulp = require('gulp');
var yargs = require('yargs');
var git = require('gulp-git');
var gutil = require('gulp-util');
var copydir = require('copy-dir');
var through = require('through2');
var confirm = require('gulp-confirm');

var settings = JSON.parse(fs.readFileSync('./config/settings.json', 'utf8'));

var args = yargs
        .alias('o', 'override')
        .alias('i', 'interactive')
        .alias('f', 'folder').describe('n', 'folder name')
        .alias('u', 'username').describe('u', 'your username')
        .alias('l', 'language').describe('l', 'your language')
            .default('l', settings.default.language)//.choices('l', settings.languages)
        .argv;

var username = args.username;
var language = args.language;
var folder = args.folder;

var getUserWorkspace = function() {
    return settings.usersPath + '/' + username;
};
var getLanguageWorkspace = function() {
    return settings.templatesPath + '/' + language;
};

gulp.task('default', ['check', 'update', 'start']);

gulp.task('check', function() {
    if (!fs.existsSync(settings.usersPath)) fs.mkdirSync(settings.usersPath);
    if (!fs.existsSync(settings.templatesPath)) fs.mkdirSync(settings.templatesPath);
    if (!fs.existsSync(settings.challengesPath)) fs.mkdirSync(settings.challengesPath);

    var userWorkspace = getUserWorkspace();
    if (!fs.existsSync(userWorkspace)) fs.mkdirSync(userWorkspace);
});

gulp.task('update', function(cb) {
    git.checkout('develop', {quiet: true}, function (err) {
        if (!err) {
            git.pull('origin', 'develop', {quiet: true}, function (err) {
                if (!err) {
                    gutil.log(gutil.colors.reset('rama'), gutil.colors.bold('develop'), gutil.colors.reset('actualizada'));
                    cb();
                } else {
                    gutil.log(gutil.colors.yellow('Error al hacer'), gutil.colors.yellow.bold('git pull origin develop'));
                    process.exit();
                }
            });
        } else {
            gutil.log(gutil.colors.yellow('Error al hacer'), gutil.colors.yellow.bold('git checkout develop'));
            process.exit();
        }
    });
});

var showHeader = through.obj(function(chunk, enc, cb) {
    gutil.log(gutil.colors.bold('<CODE> ${CHALLENGES} '));
    cb(null, chunk);
});

var validateArgs = through.obj(function(chunk, enc, cb) {
    if (!username) {
        gutil.log(gutil.colors.red('Usuario inválido'),
            gutil.colors.reset('Indica el nombre de tu usuario'));
        process.exit();
    }
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

var checkForChallange = through.obj(function(challenge, enc, cb) {
    var languageWorkspace = getLanguageWorkspace();

    if (fs.existsSync(challenge.path)) {
        if (args.override) {
            deleteFilesAndFolder(challenge.path);
        } else {
            gutil.log(gutil.colors.reset('Ya existe un workspace para el reto.'),
                gutil.colors.reset('Prueba con el parámetro'), gutil.colors.bold('-o (--override).'));
            process.exit();
        }
    }
    cb(null, challenge);
});

function deleteFilesAndFolder(folder) {
    var files = fs.readdirSync(folder);
    for (var i in files) {
        var filename = files[i];
        if (fs.statSync(folder + '/' + filename).isDirectory()) {
            deleteFilesAndFolder(folder + '/' + filename);
        } else {
            fs.unlinkSync(folder + '/' + filename);
        }
    }
    fs.rmdirSync(folder);
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

var executeScript = through.obj(function(challenge, enc, cb) {
    var userWorkspace = getUserWorkspace();
    gutil.log(gutil.colors.reset('cd '), challenge.path);

    var scripts = settings.script[language];
    for (var i in scripts) {
        gutil.log(gutil.colors.reset(scripts[i]));
    }
});

gulp.task('start', ['update'], function() {
    return gulp.src(settings.templatesPath)
        .pipe(args.interactive ? showHeader : gutil.noop())
        .pipe(args.interactive ? confirm(confirmUsername) : gutil.noop())
        .pipe(args.interactive ? confirm(confirmLanguage) : gutil.noop())
        .pipe(validateArgs)
        .pipe(getLastChallenge)
        .pipe(args.interactive ? confirm(challengeOverride) : checkForChallange)
        .pipe(createChallengeWorkspace)
        .pipe(ignoreFilesOnWorkspace)
        .pipe(prepareChallenge)
        .pipe(executeScript);
});
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
var folderQuest = gutil.colors.reset('Nombre de carpeta')
    + (folder ? gutil.colors.dim(' (' + folder + ')') : '');
var confirmFolder = {
    question: folderQuest,
    proceed: function(answer) {
        if (answer) folder = answer;
        return true;
    }
};
var challengeOverride = {
    question: gutil.colors.reset('Ya existe un workspace para codear el reto. Deseas borralo? S/N'),
    proceed: function(answer) {
        return (answer && answer.toUpperCase() == 'S');
    }
};

gulp.task('init', ['check'], function() {
    return gulp.src(settings.templatesPath)
        .pipe(args.interactive ? showHeader : gutil.noop())
        .pipe(args.interactive ? confirm(confirmUsername) : gutil.noop())
        .pipe(args.interactive ? confirm(confirmLanguage) : gutil.noop())
        .pipe(args.interactive ? confirm(confirmFolder) : gutil.noop())
        .pipe(validateArgs)
        .pipe(buildEmptyChallenge)
        .pipe(args.interactive ? confirm(challengeOverride) : checkForChallange)
        .pipe(createChallengeWorkspace)
        .pipe(ignoreFilesOnWorkspace)
        .pipe(executeScript);
});

var buildEmptyChallenge = through.obj(function(obj, enc, cb) {
    if (!folder) {
        gutil.log(gutil.colors.reset('Carpeta no especificada'),
            gutil.colors.reset('Prueba con el parámetro'), gutil.colors.bold('-f (folder)'));
        process.exit();
    }
    var userFolder = getUserWorkspace();
    obj = {path: userFolder + '/' + folder}
    cb(null, obj);
});
