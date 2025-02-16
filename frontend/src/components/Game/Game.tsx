import { LinearProgress, Typography } from "@mui/material";
import { QuestionDisplay } from "../../../../models/GameState";
import GameOptions from "../GameOptions/GameOptions";
import "./Game.css";

function Game({
  question,
  correctAnswer,
}: {
  question: QuestionDisplay;
  correctAnswer?: number;
}) {
  return (
    <div className="game">
      <div className="game-question-text">
        <Typography variant="h4">{question.text}</Typography>
      </div>
      <div className="game-time-remaining">
        <LinearProgress variant="determinate" value={50} />
      </div>
      <div className="game-question-options">
        <GameOptions
          options_text={question.options}
          correctAnswer={correctAnswer}
        />
      </div>
    </div>
  );
}

export default Game;
