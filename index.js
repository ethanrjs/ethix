const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/scripts', (req, res) => {
    // get all .js files with the format public/apps/(folder)/js.js
    // read all folders, then read all files in each folder
    const scriptPaths = [];
    const folders = fs.readdirSync(__dirname + '/public/apps');
    for (const folder of folders) {
        const files = fs.readdirSync(__dirname + `/public/apps/${folder}`);
        for (const file of files) {
            if (file.endsWith('.js')) {
                scriptPaths.push(`/apps/${folder}/${file}`);
            }
        }
    }
    res.json(scriptPaths);
});

app.listen(6543, () => {
    console.log('Listening on port 6543');
});
