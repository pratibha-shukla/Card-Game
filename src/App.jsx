import { useState } from 'react'
import './App.css'
import Snowfall from 'react-snowfall';
import Game from './Game/Game';
import Footer from './Header/Footer';
import Header from './Header/Header';


function App() {



  return (
    <>
  
         <div style={{ height: '100vh', width: '100vw', background: '#043807ff', position: 'relative', margin: "" }}>
        <Snowfall
          color="white"
          snowflakeCount={200} />
        <Game />
      </div>
      <div>
        <Footer />

      </div>

    </>
  )
}

export default App
