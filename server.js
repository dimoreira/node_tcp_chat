var net = require('net');
var HOST = process.env.HOST;
var PORT = process.env.PORT;

var server = net.createServer();
var sockets = [];

server.on('connection', function(socket) {
	var name = socket.remoteAddress + ':' + socket.remotePort;
	var s = {
		socket: socket,
		name: name
	};
	sockets.push(s);
	console.log("CONNECTED:", name);

	/*
	 * Socket data transmission
	 */
	socket.on('data', function(data) {
		var command = String(data).split(':');
		var action = command[0];
		var req_data = command[1];

		switch(action) {
			case "username":
				var i;
				sockets.map(function(sock) {
					if (sock['socket'] == socket) {
						i = sockets.indexOf(sock);
					}
				});
				if (name != req_data) {
					name = req_data.replace('\r','').replace('\n','');
					sockets[i]['name'] = name;
				}
				socket.write("Your name changed to: " + name + "\n");
				console.log("Socket name changed:", name);
				break;

			case "clients":
				socket.write("Connected clients:\n");
				sockets.map(function(s) {
					socket.write("- " + s['name'] + "\n");
				});
				break;

			case "whoami":
				for (var i=0; i < sockets.length; i++) {
					if (sockets[i]['socket'] == socket) {
						socket.write("> " + sockets[i]['name'] + "\n");
					}
				}
				break;

			case "broadcast":
				var msg = String(data).split(':')[1].replace(/(\r|\n)/,'');
				for (var i=0; i < sockets.length; i++) {
					if (sockets[i]['socket'] == socket)
						continue;
					sockets[i]['socket'].write(name + "(all): " + msg + "\n");
				}
				break;

			case "message":
				var req = String(data).split(':');
				var user = req[1];
				var msg = req[2].replace('\r','').replace('\n','');
			
				for (var i=0; i < sockets.length; i++) {
					if (sockets[i]['name'] == user) {
						sockets[i]['socket'].write(name + ": " + msg + "\n");
						break;
					}
				}
				break;

			case "exit":
				socket.end("Disconnected\n");
				break;

			default:
				socket.write("No command found\n");
		}
	});

	/*
	 * Socket connection close
	 */
	socket.on('close', function(sock) {
		console.log('CONNECTION CLOSED: ' + name);

		for (var i=0; i < sockets.length; i++) {
			if (sockets[i]['name'] == name) {
				var index = sockets.indexOf(sockets[i]);
				sockets.splice(index, 1);
			}
		}

		if (sockets.length > 0) {
			var clients = [];
			console.log("Updated clients:\n");
			sockets.map(function(sock) {
				console.log("- " + sock['name'] + "\n");
				sock['socket'].write("User \"" + name + "\" left.\n");
			});
		} else {
			console.log("Updated clients: no clients connected\n");
		}
	});
});

server.listen(PORT, HOST, function() {
	console.log('Server listening on ' + server.address().address + ':' + server.address().port);
});
