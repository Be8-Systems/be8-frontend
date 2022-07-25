const fs = require('fs');
const Applause = require('applause');
const { version } = require('../package'); 
const versionReplace = {
    //match: /\"..\//g,
    match: /{{version}}/g,
    replacement: version
};
const options = [{ // index html
    options: {
        patterns: [{
            //match: /\"..\//g,
            match: /{{urlVersion}}/g,
            replacement: `?v=${version}`
        }, versionReplace]
    },
    path: './lib/html/template.html',
    write: './lib/html/index.html',
}, { // serviceWorker
    options: {
        patterns: [versionReplace]
    },
    path: './lib/js/serviceworker.js',
    write: './dist/prod/serviceworker.js',
}, { // serviceWorker
    options: {
        patterns: [versionReplace]
    },
    path: './lib/js/serviceworker.js',
    write: './dist/dev/serviceworker.js',
}];

options.forEach(function ({ options, path, write }) {
    fs.readFile(path, 'utf8', function (err, content) {
        const applause = Applause.create(options);
        const output = applause.replace(content);
        
        if (err) {
            return console.log(err);
        }
        if (!output.content) {
            return console.log(`nothing replaced ${path}`);
        }

        fs.writeFile(write, output.content, function (err) {
            if (err) {
                return console.log(err);
            }

            return console.log(`replaced ${path}`);
        }); 
    });
});