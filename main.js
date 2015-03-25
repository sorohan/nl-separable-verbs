
var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var apiBase = 'https://glosbe.com/gapi/translate?from=nld&dest=eng&format=json';

var preferredAuthor = 'GlosbeResearch';
var lang = 'en';

var prepositions = ['op','kennis','af','uit','aan','toe','door','voor','dicht','mee','vast'];
var words = ['halen','bellen','maken','gaan','eten','doen','stellen','zetten','houden','nemen','komen','lopen','leggen','liggen'];

prepositions.forEach(function(prep) {
    words.forEach(function(word) {
        var werkword = prep + word;
        console.log('trying ' + werkword);

        /*
        var apiRq = apiBase + '&phrase=' + werkword;
        request(apiRq, function(error, response, body) {
            var result = JSON.parse(body);
            console.log('    translation for ' + werkword + ': ' + extractTranslation(result, preferredAuthor, lang));
        });
        */
    });
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

function extractTranslation(data, preferredAuthor, lang) {
    var author, phrase;

    author = _.first(_.pluck(_.select(data.authors, function(author) {
        return author.N === preferredAuthor;
    }), 'id'));

    if (!author) {
        return false;
    }

    translation = _.first(_.select(data.tuc, function(result) {
        return _.includes(result.authors, author) && result.phrase && result.phrase.language === lang;
    }));

    return translation && translation.phrase && translation.phrase.text;
}
