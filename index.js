const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(6543, () => {
    console.log('Listening on port 6543');
});
