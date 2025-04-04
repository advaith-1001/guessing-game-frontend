import { useLocation } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GameRoom() {

    const location = useLocation();
    const {roomCode, players, isHost} = location.state || {};
    const { socket , messages, player , setMessages} = useWebSocket();
    const [playerList, setPlayerList] = useState(players);
    const navigate = useNavigate();

    const startGame = () => {
        if (!isHost) {
            alert("Only the host can start the game!");
            return;
        }
        console.log("Starting the game...");

        socket.send(JSON.stringify({ type: "START_GAME", roomCode: roomCode, player: player}))

        navigate(`/room/${roomCode}/play`, {
            state: { roomCode: roomCode },
        });
        // Send WebSocket message to start the game
    };

    const exitRoom = () => {
        if (!socket) {
            console.warn("WebSocket is null, skipping disconnect.");
            setMessages([]);
            navigate("/home"); 
            return;
        }

        socket.send(JSON.stringify({ type: "EXIT_ROOM", roomCode: roomCode, player: player }));
        navigate("/home");
    
        // ✅ Close WebSocket first to prevent unnecessary messages
        setMessages([]);
        socket.close();
        setMessages([]);
    };
    
    useEffect(() => {
        // ✅ Check if WebSocket exists and is open
        if (!socket) return;
    
        const handleNewPlayer = (event) => {
            const message = JSON.parse(event.data); // ✅ Parse incoming message
    
            if (message.type === "PLAYER_JOIN") {
                console.log("New player list received:", message.data.players); // Debugging
                setPlayerList(message.data.players);
                console.log(message.data.players);
            }
        };

        const handleExitPlayer = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "PLAYER_EXIT") {
                console.log("New player list received:", message.data.players); // Debugging
                setPlayerList(message.data.players);
                console.log(message.data.players);
            }
        }

        const handleStartGame = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "START_GAME") {
                console.log("game is starting...");
                navigate(`/room/${roomCode}/play`);
            }
        }
    
        // ✅ Attach WebSocket event listener
        socket.addEventListener("message", handleNewPlayer);
        socket.addEventListener("message", handleExitPlayer);
        socket.addEventListener("message", handleStartGame);
    
        return () => {
            socket.removeEventListener("message", handleNewPlayer);
            socket.removeEventListener("message", handleExitPlayer); 
            socket.removeEventListener("message", handleStartGame);
        };
    }, [socket, roomCode]); 


    return(
        <div className="text-blue-300 bg-blue-700 flex-col h-screen w-screen flex items-center">
            <h1 className="font-bungee text-4xl text-center py-5">Game Room</h1>
            <h2 className="font-bungee text-2xl text-center py-2">CODE: {roomCode}</h2>
            <h3 className="font-bungee text-2xl text-center py-5">Players: </h3>
            <ul className="font-bungee text-2xl text-center py-5 flex flex-col items-start">
            {playerList.map((player, index) => (
                <li key={index}>{index + 1}.{player}</li>
            ))}
        </ul>
        {isHost ? (
                <button className="border-2 font-bungee cursor-pointer px-3 py-2 text-2xl rounded-lg" onClick={startGame}>Start Game</button>
            ) : (
                <p className="font-bungee text-2xl text-center py-3">Waiting for the host to start the game...</p>
            )}

<button onClick={exitRoom} >Exit Room</button>
        </div>
    );
}

export default GameRoom