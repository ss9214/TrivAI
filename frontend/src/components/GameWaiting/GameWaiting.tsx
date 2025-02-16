import { Typography } from "@mui/material";
import "./GameWaiting.css";

function GameWaiting() {
  return (
    <div className="game-waiting">
      <Typography variant="h4" style={{ fontWeight: 700 }}>
        Successfully joined!
      </Typography>
      <Typography variant="body1">
        Please wait for the game to start...
      </Typography>
    </div>
  );
}

export default GameWaiting;
