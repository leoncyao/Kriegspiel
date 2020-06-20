
var ws = new WebSocket('ws://192.168.1.69:5000');

var config = {
  draggable: true,
  dropOffBoard: 'snapback', // this is the default
  position: 'start'
} 

var board = Chessboard('myBoard', config)
var el;

ws.onmessage = function (event) {
  var msg = JSON.parse(event.data)
  switch(msg.type) {
    case "state":
      console.log("updating state")
      board.position(msg.text);
      break;
    case "time":
      console.log("updating time")
      el = document.getElementById('server-time');
      el.innerHTML = 'Server time: ' + msg.text;
      break;
  }
};



// ws.onopen = function(event) {
//   console.log("event.data " + event.data)
//   // config['position'] = event.data
//   // console.log(config.position)
//   // console.log(config)
// }


function sendMove(){
  const msg = {
    type: "state",
    text: board.fen(),
    date: Date.now()
  }
  console.log("sent " + board.fen())
  ws.send(JSON.stringify(msg))
}
$('#ResetBtn').on('click', board.start)
$('#SubmitMoveBtn').on('click', sendMove)
