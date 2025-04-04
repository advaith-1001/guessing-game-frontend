import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";

function Home() {

    const { socket, connectWebSocket, setPlayer , messages} = useWebSocket();
    const [localUsername, setLocalUsername] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [joining, setJoining] = useState(false);
    const navigate = useNavigate();
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        messages.forEach((message) => {
            if (message.type === "ROOM_CREATED") {
                navigate(`/room/${message.data.roomCode}`, {
                    state: { roomCode: message.data.roomCode , players:message.data.players, isHost},
                });
                console.log(message.data.players);
            }
            if (message.type === "PLAYER_JOIN") {
                navigate(`/room/${roomCode}`, { 
                    state: { roomCode: roomCode, players: message.data.players} 
                });
                console.log(message.data.players);
            }
        });
    }, [messages, navigate]);

    const createRoom = async () => {
        if (localUsername.trim()) {
            try {
                const ws = await connectWebSocket(); // ⏳ Wait for WebSocket connection
                setPlayer(localUsername);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "CREATE_ROOM", player: localUsername }));
                    setIsHost(true);
                } else {
                    console.error("WebSocket is still not open!");
                }
            } catch (error) {
                console.error("Failed to connect WebSocket:", error);
            }
        }
    };

    const joinRoom = async () => {
        if (localUsername.trim() && roomCode.trim()) {
            try {
                const ws = await connectWebSocket(); // ⏳ Wait for WebSocket connection
                setPlayer(localUsername);

                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "JOIN_ROOM", player: localUsername, roomCode }));
                } else {
                    console.error("WebSocket is still not open!");
                }
            } catch (error) {
                console.error("Failed to connect WebSocket:", error);
            }
        }
    };


    return(
        <div className="flex-col h-screen w-screen flex justify-center items-center bg-blue-700">
        <h1 className="font-bungee text-7xl text-blue-400">GUESSBLITZ⚡</h1>
            <div className="text-blue-300 flex flex-col gap-10 items-center justify-center py-50">
                <input type="text" value={localUsername} onChange={(e) => setLocalUsername(e.target.value)} placeholder="USERNAME" className="border-2 w-80 h-15 rounded-lg text-2xl px-2 text font-bungee placeholder:username "/>
                <div className="flex gap-4 items-center justify-center flex-wrap">
                    <button onClick={createRoom} className="border-2 font-bungee cursor-pointer px-3 py-2 text-2xl rounded-lg">Create Room</button>
                    <p className="font-bungee text-2xl">Or</p>
                    <button onClick={joinRoom} className="border-2 font-bungee cursor-pointer px-3 py-2 text-2xl rounded-lg">Join Room</button>
                    <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="roomcode" className="border-2 w-50 h-13 rounded-lg text-2xl px-2 text font-bungee"/>
                </div>
            </div>
        </div>
    );
}

export default Home