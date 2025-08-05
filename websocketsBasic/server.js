const WebSocket = require('ws');
const express = require('express');
const path = require('path');

// Create an instance of an Express application
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
// This is the key part for serving HTML, CSS, and client-side JS
app.use(express.static(path.join(__dirname, 'public')));

// Start the server and listen for connections on the specified port
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

let clientId = 0;

wss.on('connection', (ws) => {
  ws.id = ++clientId;
  console.log(`Client ${ws.id} connected`);

  const broadcast = (message, senderId) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ senderId, message }));
      }
    });
  };
  ws.on('message', data => {
    const message = data.toString("utf8");
    console.log(`Received message from client ${ws.id}: ${message}`);
    const broadcastMessage = JSON.stringify({ senderId: ws.id, message });
    broadcast(broadcastMessage, ws.id);
  });

  ws.on('close', () => {
    console.log(`Client ${ws.id} disconnected`);
    const disconnectMessage = JSON.stringify({ senderId: ws.id, message: `${ws.id} has left the chat` });
    broadcast(disconnectMessage, ws.id);
  });

  ws.on('error', (error) => {
    console.error(`Error from client ${ws.id}:`, error);
  });
});