// server.js
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';

// --- 1. Basic Setup ---
const port = process.argv[2] || 8080; // Get port from command line or default to 8080
const wss = new WebSocketServer({ port });

const redisChannel = 'chat_room';

// --- 2. Create Redis Clients ---
// NOTE: According to Redis pub/sub documentation, a client that subscribes
// cannot publish. So we need two separate clients.
const publisher = createClient();
const subscriber = createClient();

// Main function to set everything up
async function main() {
  await publisher.connect();
  await subscriber.connect();
  console.log('✅ Connected to Redis.');

  // --- 3. Redis Subscriber Logic ---
  // This is the core of the backplane. When a message is published on the
  // 'chat_room' channel, this subscriber receives it and broadcasts it
  // to all WebSocket clients connected *to this specific server instance*.
  await subscriber.subscribe(redisChannel, (message) => {
    console.log(`[${port}] Received message from Redis: ${message}. Broadcasting to my clients.`);
    
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  });

  // --- 4. WebSocket Server Logic ---
  wss.on('connection', (ws) => {
    console.log(`[${port}] Client connected.`);

    // When a client sends a message, we don't broadcast it directly.
    // Instead, we publish it to Redis.
    ws.on('message', async (data) => {
      const messageString = data.toString();
      console.log(`[${port}] Received message from client: ${messageString}. Publishing to Redis.`);
      
      // Publish the message to the Redis channel.
      // Every server instance (including this one) subscribed to the channel will receive it.
      await publisher.publish(redisChannel, messageString);
    });

    ws.on('close', () => {
      console.log(`[${port}] Client disconnected.`);
    });
  });

  console.log(`🚀 WebSocket server instance running on ws://localhost:${port}`);
}

main().catch(console.error);