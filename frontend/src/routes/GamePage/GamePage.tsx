import "./GamePage.css";
import GameOptions from "../../components/GameOptions/GameOptions.tsx";
import { QuestionDisplay } from "../../../../models/GameState.ts";
import Game from "../../components/Game/Game.tsx";
import GameLobby from "../../components/GameLobby/GameLobby.tsx";
import GameWaiting from "../../components/GameWaiting/GameWaiting.tsx";
import QuestionResult from "../../components/QuestionResult/QuestionResult.tsx";

function GamePage() {
  const isOwner = true;
  const gameStarted = true;
  const questionEnded = true;
  const correctAnswer = 0;
  const question: QuestionDisplay = {
    text: "This is the question",
    options: [
      "This is option 1",
      "This is option 2",
      "This is option 3",
      "This is option 4",
    ],
  };

  return isOwner ? (
    gameStarted ? (
      <Game question={question} correctAnswer={correctAnswer} />
    ) : (
      <GameLobby />
    )
  ) : gameStarted ? (
    questionEnded != undefined ? (
      <QuestionResult correctAnswer={correctAnswer} />
    ) : (
      <GameOptions />
    )
  ) : (
    <GameWaiting />
  );
}

export default GamePage;
