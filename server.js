// const { request, response } = require('express');
const express = require('express');
const path = require('path');

// create express app
const app = express();

// handle the root '/' request
app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'index.html'));
});

// serve other files from current 'dir' under the root request dir
app.use('/', express.static(path.resolve(__dirname, './')));

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`server is listening on port ${port}!`))