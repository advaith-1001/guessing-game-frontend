import { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { useLocation } from "react-router-dom";

function GamePlay() {

    const { socket, messages, player } = useWebSocket();
    const location = useLocation();
    const roomCode = location.state?.roomCode || "";
    const [guess, setGuess] = useState("");
    const [flagUrl, setFlagUrl] = useState(null);
    const [round, setRound] = useState(1);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [roundWinner, setRoundWinner] = useState("");
    const [gameWinner, setGameWinner] = useState("");

    useEffect(() => {
        if(!socket) {
            return;
        }

        const handleGameUpdate = (event) => {
            const message = JSON.parse(event.data);


            if(message.type == "NEW_ROUND") {
                setRound(message.data.number);
                setFlagUrl(message.data.flagUrl || null);
                setCorrectAnswer("");
                setRoundWinner("");
            }

            if(message.type == "CORRECT_ANSWER") {
                setCorrectAnswer(message.data.answer);
                setRoundWinner(message.data.player);
            }

            if(message.type == "GAME_OVER") {
                setGameWinner(message.data.winner);
            }
        }

        socket.addEventListener("message", handleGameUpdate);

    })

    const sendGuess = () => {
        if(!socket || guess.trim() === "") return;
        console.log(JSON.stringify({
            type: "SUBMIT_ANSWER",
            player: player,
            roomCode: roomCode,
            answer: guess
        }));

        socket.send(
            JSON.stringify({
                type: "SUBMIT_ANSWER",
                player: player,
                roomCode: roomCode,
                answer: guess
            })
        )
    }

    return(
        <div className="h-screen w-screen bg-amber-400 flex flex-col items-center justify-center gap-10">
            <h1 className="font-bungee text-3xl text-center py-5">ROUND: {round}</h1>
            {flagUrl && <img src={flagUrl} alt="flag-img" className="max-w-[200px] h-auto" />}
            <div className="flex gap-4">
            <input onChange={(e) => setGuess(e.target.value)} type="text" placeholder="YOUR GUESS" value={guess} className="border-2 w-70 h-13 rounded-lg text-2xl px-2 text font-bungee"/>
            <button className="border-2 font-bungee cursor-pointer px-3 py-2 text-2xl rounded-lg" onClick={sendGuess}>GUESS</button>
            </div>
            <p className="font-bungee">CORRECT ANSWER: {correctAnswer}</p>
            <p className="font-bungee">ROUND WINNER: {roundWinner}</p>
            <p className="font-bungee text-2xl">GAME WINNER: {gameWinner}</p>
        </div>
    );

}

export default GamePlay;