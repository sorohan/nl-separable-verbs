
var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var apiBase = 'https://glosbe.com/gapi/translate?from=nld&dest=eng&format=json';
var q = require('q');

var lang = 'en';
var prepositions = ['op','kennis','af','uit','aan','toe','door','voor','dicht','mee','vast'];
var words = ['halen','bellen','maken','gaan','eten','doen','stellen','zetten','houden','nemen','komen','lopen','leggen','liggen'];

var translations = {
    // uitdoen: [
    //    <phrase|meanings>,...
    // ]
};

var promises = [];

prepositions.forEach(function(prep) {
    words.forEach(function(word) {
        var werkword = prep + word;

        var apiRq = apiBase + '&phrase=' + werkword;
        var deferred = q.defer();

        request(apiRq, function(error, response, body) {
            var result = JSON.parse(body);
            var translation = {
                werkword: werkword,
                translations: extractTranslations(result, lang)
            };
            deferred.resolve(translation);
        });

        promises.push(deferred.promise);
    });
});

q.all(promises).then(function(translations) {
    // filter out empty.
    var validWords = _.select(translations, function(t) {
        return t.translations.length > 0;
    });
    process.stdout.write(JSON.stringify({translations: validWords}));
});

/*
request(api, function(error, response, body) {
    console.log(JSON.parse(body));
});
*/

/*
fs.readFile('./oversteken.define', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var result = JSON.parse(data);
    console.log(extractTranslation(result, preferredAuthor, lang));
});
*/

function extractTranslations(data, lang) {
    var wrapped = _(data.tuc);

    return wrapped.select(function(result) {
        return result.phrase && result.phrase.language === lang;
    }).map(function(translation) {
        return (translation.phrase && translation.phrase.text);
    }).value();
}
