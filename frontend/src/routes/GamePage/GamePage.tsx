import "./GamePage.css";
import GameOptions from "../../components/GameOptions/GameOptions.tsx";
import Game from "../../components/Game/Game.tsx";
import GameLobby from "../../components/GameLobby/GameLobby.tsx";
import GameWaiting from "../../components/GameWaiting/GameWaiting.tsx";
import QuestionResult from "../../components/QuestionResult/QuestionResult.tsx";
import UserEnd from "../../components/UserEnd/UserEnd.tsx";
import GameEnd from "../../components/GameEnd/GameEnd.tsx";
import { useAppSelector } from "../../store/hooks.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { getLifePoints } from "../../store/selectors.ts";

function GamePage() {
  const userState = useAppSelector((state) => state.user);
  const gameState = useAppSelector((state) => state.gameState);
  const lifePoints = useSelector((state: RootState) =>
    userState ? getLifePoints(userState.userId)(state) : null
  );
  const isOwner = gameState && userState?.userId === gameState?.owner;
  const correctAnswer = 0;

  return (
    gameState &&
    (isOwner ? (
      gameState.status === "completed" ? (
        <GameEnd />
      ) : gameState.status === "idle" ? (
        <GameLobby />
      ) : (
        gameState && (
          <Game
            question={gameState.questionDisplay}
            correctAnswer={correctAnswer}
          />
        )
      )
    ) : gameState.status === "completed" ||
      (lifePoints != null && lifePoints <= 0) ? (
      <UserEnd />
    ) : gameState.status === "active" ? (
      correctAnswer !== undefined ? (
        <QuestionResult correctAnswer={correctAnswer} />
      ) : (
        <GameOptions />
      )
    ) : (
      <GameWaiting />
    ))
  );
}

export default GamePage;
