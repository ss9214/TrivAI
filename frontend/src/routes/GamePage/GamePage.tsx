import { Typography } from "@mui/material";
import "./GamePage.css";
import GameOptions from "../../components/GameOptions/GameOptions.tsx";

function GamePage() {
  const isUser = true;

  return isUser ? <GameOptions /> : <Typography>game</Typography>;
}

export default GamePage;
