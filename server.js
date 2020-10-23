const Launchpad = require( 'launchpad-mini' ),
      pad = new Launchpad();

const http = require('http')
const express = require('express')

const app = express()
app.use(express.static('public'))

app.set('port', '3000')

const server = http.createServer(app)
server.on('listening', () => {
 console.log('Listening on port 3000')
})

server.listen('3000')
const io = require('socket.io')(server);


const grid =  [ 
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
];
let keys = grid;


io.sockets.on('connection', (socket) => {
	console.log('Client connected: ' + socket.id)

	socket.on('getGrid', (data) => {
		console.log('getGrid')
		io.emit('launchpad:grid', keys)
	})

	socket.on('pressed', (k)=>{
		console.log('pressed', k);
		keys[k.y][k.x] = !keys[k.y][k.x];
		pad.col( keys[k.y][k.x] ? pad.red : pad.off, [[k.x,k.y]]);
		let msg = { x : k.x, y: k.y, val: keys[k.y][k.x] } 
		io.emit('launchpad:out', msg);  
	})
	socket.on('disconnect', () => console.log('Client has disconnected'))
 })


pad.connect().then( () => {     
    pad.reset(  );            
		io.emit('launchpad:reset', 'reset');

	
    pad.on( 'key', k => {
		//pad.reset( 2 );
		if(k.pressed){
			keys[k.y][k.x] = !keys[k.y][k.x];
			console.log(k.x, k.y, k.pressed, keys[k.y][k.x]); 
			pad.col( keys[k.y][k.x] ? pad.red : pad.off, k);
			let msg = { x : k.x, y: k.y, val: keys[k.y][k.x] } 
			io.emit('launchpad:out', msg);  
		}
		
		if(k.x == 8 && k.y == 7 && k.pressed){
			console.log('reset');
			pad.reset();
			io.emit('launchpad:reset', 'reset');  
			keys = grid;
		}
		
    } );
} );



// const mqtt = require('mqtt')
// const client = mqtt.connect('mqtt://localhost')

// client.on('connect', () => {
//   console.log('Connected');
//   // Inform controllers that garage is connected
//   client.publish('launchpad/connected', 'true');
//   client.subscribe('launchpad/in');
  
// })
// client.on('message', function(topic, message) {
// 	msg = message.toString();
// 	console.log(msg);
// 	console.log(topic);
// 	/* switch (topic) {
// 		case 
// 	} */
// });