/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// your express configuration here

const express = require("express");
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();

// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);

// const cors = require('cors');
// var bodyParser = require('body-parser');

// app.use(express.static(__dirname + '/uploads'));
// app.use(bodyParser.json());
// app.use(cors());

var httpServer = http.createServer(app);

app.get('/hello', function (req, res) {
    res.send("Hello from Firebase!")
})

app.get('/newRoute', function (req, res) {
    res.send("This is neww Route!")
})

app.get('/getItems', function (req, res) {
    console.log('>>>>>getItems');
    var data = {
        text: 'hello'
    };

    return res.json(data);
});


// Create and deploy your first functions

httpServer.listen(process.env.PORT || 8888, function () {
    console.log('listening on *:8888');
});



