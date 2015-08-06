# node_tcp_chat
***

TCP/Sockets chat application protocol using the standard `net` library from `nodejs`.

## Protocol Example

**`clients:`**

Print a list of connected clients.


**`whoami:`**

Print the username for the current connected user.


**`username:`**`<your-username>`

Sets / updates the username for the current connected user.


**`broadcast:`**`<message>`

Sends a message to all the clients connected.


**`message:`**`<username>`**:**`<message>`

Sends a message to the specified username.


**`exit:`**

Disconnect the current user from the socket.


## Usage

Just download the repository and start the TCP server:

```
$ node server.js
```

Next you could implement a client to connect to the socket and utilize the protocol to communicate with the server.

> For tests, you could simple `telnet` to the server and test the protocol usage.