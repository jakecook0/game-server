// const { request, response } = require('express');
const express = require('express');
const path = require('path');

// create express app
const app = express();

// handle the root '/' request
app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'index.html'));
});

// app.get('/frogger', (request, response) => {
//     response.sendFile(path.resolve(__dirname, 'index.html'));
// });

// app.get('/maze', (request, response) => {
//     response.sendFile(path.resolve(__dirname, 'maze/index.html'));
// });

// app.get('/lunar-lander', (request, response) => {
//     response.sendFile(path.resolve(__dirname, 'lunar-lander/index.html'));
// });

// app.get('/defuser', (request, response) => {
//     response.sendFile(path.resolve(__dirname, 'defuser/index.html'));
// });

// serve other files from current 'dir' under the root request dir
app.use('/', express.static(path.resolve(__dirname, './')));
app.use(express.static('frogger'));
app.use(express.static('maze'));
app.use(express.static('defuser'));
app.use(express.static('lunar-lander'));

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`server is listening on port ${port}!`))