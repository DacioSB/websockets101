import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8081;

// Server static html
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

console.log(`Server started at http://localhost:${port}`);

const stocks = {
    'AAPL': 150.00,
    'GOOGL': 2750.00,
    'MSFT': 300.00,
    'AMZN': 3400.00,
};

function updateStockPrices() {
    const updates = {}

    for (const stock in stocks) {
        const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        stocks[stock] = Math.max(0, stocks[stock] + change); // Ensure stock price doesn't go negative
        updates[stock] = stocks[stock];
    }
    return updates;
}

//Broadcast updates every 2 seconds
setInterval(() => {
    const updates = updateStockPrices();
    const message = JSON.stringify({"type": "stockUpdate", "data": updates });

    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}, 2000);

// Handle WebSocket connections
wss.on('connection', ws => {
    console.log('Client connected to stock ticker');
    ws.send(JSON.stringify({ type: 'initialStocks', data: stocks }));

    ws.on('close', () => console.log('Client disconnected'));
});

// Start the server
server.listen(port, () => {
    console.log(`WebSocket + Express server running at http://localhost:${port}`);
});