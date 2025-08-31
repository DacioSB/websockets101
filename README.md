# Websockets101: A Collection of WebSocket Projects

This repository contains a collection of projects that demonstrate various use cases of WebSockets.

## Projects

### 1. Basic Chat

*   **Folder:** `websocketsBasic`
*   **Description:** A simple chat application that demonstrates the basic principles of WebSocket communication. The server broadcasts messages to all connected clients.
*   **To run:**
    ```bash
    cd websocketsBasic
    npm install
    npm start
    ```
    Open `public/index.html` in your browser.

### 2. Real-Time Stock Ticker

*   **Folder:** `websocketsStockTicker`
*   **Description:** A real-time stock ticker that showcases server-pushed updates. The server periodically sends simulated stock price updates to all connected clients.
*   **To run:**
    ```bash
    cd websocketsStockTicker
    npm install
    node server.js
    ```
    Open `public/index.html` in your browser.

### 3. Scaled WebSocket Chat

*   **Folder:** `scaledWebsocketChat`
*   **Description:** A chat application designed for scalability. It uses Redis Pub/Sub to enable communication between multiple server instances, allowing for a distributed and horizontally scalable chat service.
*   **To run:**
    1.  Start a Redis server.
    2.  Run multiple server instances on different ports:
        ```bash
        cd scaledWebsocketChat
        npm install
        node server.js 8080
        node server.js 8081
        ```
    3.  Open `index.html` in your browser. The client will connect to one of the available server instances.

## Author

Dacio Bezerra