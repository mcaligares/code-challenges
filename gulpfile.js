var fs = require('fs');
var gulp = require('gulp');
var yargs = require('yargs');
var copydir = require('copy-dir');
//TODO add readline option

//TODO use a file config
var enabledLanguages = [
    'javascript'
];

var anonymous = 'anonymous';
var usersPath = 'users';
var templatesPath = 'templates';
var challengesPath = 'challenges';

var args = yargs
        .alias('u', 'username').describe('u', 'your username').default('u', 'anonymous')
        .alias('l', 'language').describe('l', 'your language').default('l', 'js')
            .choices('l', enabledLanguages)
        .argv;

//TODO use a file config
var ignoreFiles = {
    'javascript': [
        'node_modules'
    ]
};

gulp.task('default', ['start']);

gulp.task('check', function() {
    if (!fs.existsSync(usersPath)) fs.mkdirSync(usersPath);
    if (!fs.existsSync(templatesPath)) fs.mkdirSync(templatesPath);
    if (!fs.existsSync(challengesPath)) fs.mkdirSync(challengesPath);
});

gulp.task('start', ['check'], function() {
    console.log('starting new challenge..');

    var username = args.username;
    var language = args.language;
    var userWorkspace = usersPath + '/' + username;

    if (!fs.existsSync(userWorkspace)) fs.mkdirSync(userWorkspace);

    var lastChallange = getLastFileModified(fs.readdirSync(challengesPath));
    if (lastChallange) {
        var userChallangePath = userWorkspace + '/' + lastChallange.name;
        buildWorkspaceToChallange(userChallangePath, language);
        readChallenge(lastChallange);
    } else {
        //TODO translate
        console.error('No tienes retos por ahora. Anímate y escribe uno!');
    }
});

function getLastFileModified(/*Array*/ files) {
    var resultFile;
    for (var i in files) {
        var filename = files[i];
        var file = fs.statSync(challengesPath + '/' + filename);
        if (!resultFile) {
            resultFile = {name: filename, file: file};
        } else if (resultFile.file.mtime < file.mtime) {
            resultFile = {name: filename, file: file};
        }
    }
    return resultFile;
}

function buildWorkspaceToChallange(userChallengeWorkspacePath, language) {
    var templateForLanguagePath = templatesPath + '/' + language;
    if (fs.existsSync(templateForLanguagePath)) {
        if (!fs.existsSync(userChallengeWorkspacePath)) {
            fs.mkdirSync(userChallengeWorkspacePath);
            copydir.sync(templateForLanguagePath, userChallengeWorkspacePath);
            ignoreFilesOnWorkspace(userChallengeWorkspacePath, language);
            //TODO go to workspace and run test
        }
        if (args.username != 'anonymous') {
            console.log('you are ready to work! good luck ' + args.username +'!');
        }
    } else {
        console.error('La plantilla para el lenguaje ' + language + ' no existe!. Anímate y crea una!');
    }
}

function ignoreFilesOnWorkspace(path, language) {
    var gitIgnoreFile = path + '/.gitignore';
    var ignoredFilesByLanguage = ignoreFiles[language];
    for (var i in ignoredFilesByLanguage) {
        fs.writeFileSync(gitIgnoreFile, ignoredFilesByLanguage[i]);
    }
}

function readChallenge(challenge) {
    var challengeFile = challengesPath + '/' + challenge.name;
    var text = fs.readFileSync(challengeFile, {encoding: 'utf-8'});
    console.log('*** ' + challenge.name + ' ***');
    console.log(text);
}
