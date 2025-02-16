import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
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
import { setGameState } from "../../store/gameStateSlice.tsx";
import { getGameState } from "../../services.ts";

function GamePage() {
  const dispatch = useDispatch();
  const gameId = useParams<{ gameId: string }>().gameId;
  const userId = sessionStorage.getItem("userId");
  const gameState = useAppSelector((state) => state.gameState);
  const lifePoints = useSelector((state: RootState) =>
    userId ? getLifePoints(userId)(state) : null
  );
  const isOwner = gameState && userId === gameState?.ownerId;
  const correctAnswer = 0;

  useEffect(() => {
    const fetchGameData = async () => {
      if (gameId) {
        sessionStorage.setItem("gameId", gameId);
        try {
          const data = await getGameState(gameId);
          dispatch(setGameState(data.gameState));
        } catch (error) {
          console.error("Failed to fetch game state:", error);
        }
      }
    };

    fetchGameData();
  }, [dispatch, gameId]);

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
