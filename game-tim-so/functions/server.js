const express = require('express')
const http = require('http')
const WebSocket = require('ws');

const server = http.createServer(express)
const wss = new WebSocket.Server({ server });

wss.on('connection', function conenction(ws) {
    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState == WebSocket.OPEN) {
                client.send(data.toString());
            }
        })
        // wss.broadcast(ws, data.toString());
    })
})

server.listen(process.env.PORT || 8888, function () {
    console.log('listening on *:8888');
});