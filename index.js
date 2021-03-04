const core = require('@actions/core')
const fs = require('fs')
const request = require('request');

function getJSON(url) {
    return new Promise((resolve, reject) => {
        request.get(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
        });
    });
}

(async () => {
    const repository = core.getInput('repository');
    const before = core.getInput('before');
    const after = core.getInput('after');
    console.log(`repository: ${repository}`);
    console.log(`before: ${before}`);
    const url = `https://api.github.com/repos/${repository}/compare/${before}...${after}`
    const json = JSON.parse(await getJSON(url));
    const files = json['files'];
    console.log(`files: ${files}`);

    let paths = files
        .map(x => x['filename'].match(/part\d\/.+?(?=\/)/))
        .filter(Boolean);
    console.log(`paths0: ${paths}`);
    paths = [...new Set(paths)];
    console.log(`paths1: ${paths}`);
})();