import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { WebSocketProvider } from './context/WebSocketContext'
import GameRoom from './pages/Gameroom'
import GamePlay from './pages/GamePlay'

function App() {

  return (
    <WebSocketProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/room/:roomCode' element={<GameRoom />} />
        <Route path='/room/:roomCode/play' element={<GamePlay />}/>
      </Routes>
    </WebSocketProvider>
  )
}

export default App
