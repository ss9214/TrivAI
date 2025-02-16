import "./GameJoinPage.css";
import { Typography, Button } from "@mui/material";
import React, { useState } from 'react';
import { v4 as uuidv4} from 'uuid';

function GameJoinPage() {
  const [nameValue, setNameValue] = useState<string>('');
  const [codeValue, setCodeValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodeValue(event.target.value);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };
  const handleJoinGame = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameValue,
          gameId: codeValue,
          userId: uuidv4() // cache userId
        }),
      });

      if (response.status === 200) {
        // If the response is OK, navigate to the game page
        window.location.href = `/game/${codeValue}`; // Redirect to the game page
      } else if (response.status === 404) {
        // If the game doesn't exist
        setErrorMessage('Game does not exist.');
      } else {
        // Handle other status codes if necessary
        setErrorMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="game-create-container">
      <Typography variant="h4" style={{ paddingBottom:'1%' }}>Join a Game</Typography>
      <div style={{padding:"2%"}}>
        <input 
          type="text"
          id='nameInput'
          value={nameValue}
          onChange={handleNameChange}
          className="text-input"
          placeholder="Enter Player Name"
        />
      </div>
      <div style={{padding:"2%"}}>
        <input 
          type="text"
          id='codeInput'
          value={codeValue}
          onChange={handleCodeChange}
          className="text-input"
          placeholder="Enter Game Code"
        />
      </div>
      
      <Button variant="contained" onClick={handleJoinGame} style={{ marginTop: "2%", marginBottom:"2%", backgroundColor:"#1e293b", width:"20%", height:"7%"}}>
        Join Game
        </Button>
       {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Display error message */}
    </div>

  );
}


export default GameJoinPage;


