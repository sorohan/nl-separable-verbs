
var fs = require('fs');

fs.readFile('./translations.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var result = JSON.parse(data);
    result.translations.forEach(function(translation) {
        process.stdout.write(
            translation.werkword + ':' + "\n    " +
            translation.translations.join(', ') +
            "\n\n"
        );
    });
});
