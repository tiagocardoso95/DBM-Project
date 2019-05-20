const express = require("express");
const app = express();
var fs = require('fs');
var mustache = require('mustache');
var childProcess = require('child_process');

app.use(express.static('public'));

app.post('/startServer', (req, res) => {
    var config = JSON.parse(fs.readFileSync('./Server/config.json'));
    var template = fs.readFileSync('./Server/server.mustache').toString();

    var output = mustache.render(template, (config));

    fs.writeFileSync('./publish/index.js', output);

    childProcess.fork('./publish/index.js');
    res.sendStatus(200);
});


app.listen(8081, () => {
    console.log("Server started on port 8081!");
});