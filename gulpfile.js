var fs = require('fs');
var gulp = require('gulp');
var yargs = require('yargs');
var copydir = require('copy-dir');
//TODO add readline option

var settings = JSON.parse(fs.readFileSync('./config/settings.json', 'utf8'));

var args = yargs
        .alias('u', 'username').describe('u', 'your username').default('u', settings.default.username)
        .alias('l', 'language').describe('l', 'your language').default('l', settings.default.language)
            .choices('l', settings.languages)
        .argv;

gulp.task('default', ['start']);

gulp.task('check', function() {
    if (!fs.existsSync(settings.usersPath)) fs.mkdirSync(settings.usersPath);
    if (!fs.existsSync(settings.templatesPath)) fs.mkdirSync(settings.templatesPath);
    if (!fs.existsSync(settings.challengesPath)) fs.mkdirSync(settings.challengesPath);
});

gulp.task('start', ['check'], function() {
    console.log('starting new challenge..');

    var username = args.username;
    var language = args.language;
    var userWorkspace = settings.usersPath + '/' + username;

    if (!fs.existsSync(userWorkspace)) fs.mkdirSync(userWorkspace);

    var lastChallange = getLastFileModified(fs.readdirSync(settings.challengesPath));
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
        var file = fs.statSync(settings.challengesPath + '/' + filename);
        if (!resultFile) {
            resultFile = {name: filename, file: file};
        } else if (resultFile.file.mtime < file.mtime) {
            resultFile = {name: filename, file: file};
        }
    }
    return resultFile;
}

function buildWorkspaceToChallange(userChallengeWorkspacePath, language) {
    var templateForLanguagePath = settings.templatesPath + '/' + language;
    if (fs.existsSync(templateForLanguagePath)) {
        if (!fs.existsSync(userChallengeWorkspacePath)) {

            console.log('creando workspace en ' + userChallengeWorkspacePath);
            fs.mkdirSync(userChallengeWorkspacePath);
            copydir.sync(templateForLanguagePath, userChallengeWorkspacePath);
            ignoreFilesOnWorkspace(userChallengeWorkspacePath, language);
            //TODO go to workspace and run test
        }
        if (args.username != settings.anonymous) {
            console.log('you are ready to work! good luck ' + args.username +'!');
        }
    } else {
        console.error('La plantilla para el lenguaje ' + language + ' no existe!. Anímate y crea una!');
    }
}

function ignoreFilesOnWorkspace(path, language) {
    var gitIgnoreFile = path + '/.gitignore';
    var ignoredFilesByLanguage = settings.ignoreFiles[language];
    for (var i in ignoredFilesByLanguage) {
        fs.writeFileSync(gitIgnoreFile, ignoredFilesByLanguage[i]);
    }
}

function readChallenge(challenge) {
    var challengeFile = settings.challengesPath + '/' + challenge.name;
    var text = fs.readFileSync(challengeFile, {encoding: 'utf-8'});
    console.log('*** ' + challenge.name + ' ***');
    console.log(text);
}
