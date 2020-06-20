const express = require('express'); 
const fs = require("fs");


const path = require('path')

const PORT = process.env.PORT || 5000;

const server = express()
    .use(express.static(path.join(__dirname, 'public')))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const { Server } = require('ws');

const wss = new Server({ server });

// var state = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'

wss.on('connection', (ws) => {
    const state = fs.readFileSync("./board.txt");
    var msg = {
        type: "state",
        text: state,
        date: Date.now()
      };
    console.log('Client connected');

    ws.send(JSON.stringify(msg))
    
    // updating state from client message
    ws.onmessage = function (event) {
        console.log("received something")
        var msg = JSON.parse(event.data)
        switch(msg.type) {
            case "state":
                console.log("updating state")
                fs.writeFile("./board.txt", msg.text)
                
            }
        };
    ws.on('close', () => console.log('Client disconnected'));
  });



setInterval(() => {
wss.clients.forEach((client) => {
    var msg = {
        type: "time",
        text: new Date().toTimeString(),
        date: Date.now()
      };
    client.send(JSON.stringify(msg));
    // client.send('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R')

});
}, 1000);

