import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [player, setPlayer] = useState("");
    const [players, setPlayers] = useState([]);

    const connectWebSocket = () => {
        return new Promise((resolve, reject) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                resolve(socket);
                return;
            }

            const ws = new WebSocket("ws://localhost:8080/game");

            ws.onopen = () => {
                console.log("✅ WebSocket Connected!");
                setSocket(ws);
                resolve(ws);
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("📩 Message received:", message);
                setMessages((prev) => [...prev, message]);
            };

            ws.onerror = (err) => {
                console.error("❌ WebSocket Error:", err);
                reject(err);
            };

            ws.onclose = () => {
                console.log("🔌 WebSocket Disconnected.");
                setSocket(null);
            };
        });
    };

    const disconnectWebSocket = () => {
        if (socket) {
            socket.close();
            setSocket(null);
            console.log("WebSocket connection closed.");
        }
    };


    return(
        <WebSocketContext.Provider value={{socket, connectWebSocket, disconnectWebSocket, messages, player, setPlayer, players , setMessages}}>
        {children}
        </WebSocketContext.Provider >
    );
};

export const useWebSocket = () => useContext(WebSocketContext); 