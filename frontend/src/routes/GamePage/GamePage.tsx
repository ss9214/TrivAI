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
import {
  gameStateEnd,
  getGameState,
  nextQuestion,
  setCompletionTime,
  setCorrectAnswer,
} from "../../services.ts";
import { UserStatus } from "../../../../models/GameState.ts";

function GamePage() {
  const dispatch = useDispatch();
  const gameId = useParams<{ gameId: string }>().gameId;
  const userId = sessionStorage.getItem("userId");
  const gameState = useAppSelector((state) => state.gameState);
  const lifePoints = useSelector((state: RootState) =>
    userId ? getLifePoints(userId)(state) : null
  );
  const isOwner = gameState && userId === gameState?.ownerId;

  const endGame = async (gameId: string) => {
    const data = await gameStateEnd(gameId);
    dispatch(setGameState(data.gameState));
  };

  const fetchGameState = async () => {
    if (!gameId) return;
    try {
      const data = await getGameState(gameId);
      dispatch(setGameState(data.gameState));
    } catch (error) {
      console.error("Error fetching game state:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGameState();
    }, 1000);

    return () => clearInterval(interval);
  }, [
    gameId,
    gameState,
    gameState?.question_index,
    gameState?.correctAnswer,
    dispatch,
  ]);

  useEffect(() => {
    if (!gameState || !gameState.completionTime) return;

    const checkGameStatus = () => {
      const now = Date.now();
      const completionTimeMs =
        new Date(gameState.completionTime).getTime() - 18000000;

      console.log(now > completionTimeMs, now, completionTimeMs);
      if (gameState.correctAnswer === null) {
        if (
          now > completionTimeMs ||
          gameState.userStatuses.filter(
            (userStatus: UserStatus) => userStatus.answer === null
          ).length
        ) {
          if (
            gameState.questionDisplay.options === null ||
            (lifePoints !== null && lifePoints <= 0)
          ) {
            if (gameId) {
              endGame(gameId);
            }
          } else {
            if (gameId) {
              setCorrectAnswer(gameId);
              setCompletionTime(gameId, new Date(now + 5000));
              dispatch(
                setGameState({
                  ...gameState,
                  completionTime: new Date(now + 5000).getTime(),
                })
              );
            }
          }
        }
      } else {
        if (now > completionTimeMs) {
          if (gameId) {
            setCorrectAnswer(gameId);
            nextQuestion(gameId);
            setCompletionTime(gameId, new Date(now + 30000));
            dispatch(
              setGameState({
                ...gameState,
                question_index: gameState.question_index + 1,
                completionTime: new Date(now + 30000).getTime(),
              })
            );
          }
        }
      }
    };

    checkGameStatus();
    const timer = setInterval(checkGameStatus, 1000);
    return () => clearInterval(timer);
  }, [gameState, lifePoints, dispatch]);

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
            correctAnswer={gameState.correctAnswer}
          />
        )
      )
    ) : gameState.status === "completed" ||
      (lifePoints != null && lifePoints <= 0) ? (
      <UserEnd />
    ) : gameState.status === "active" ? (
      gameState.correctAnswer !== undefined ? (
        <QuestionResult correctAnswer={gameState.correctAnswer} />
      ) : (
        <GameOptions />
      )
    ) : (
      <GameWaiting />
    ))
  );
}

export default GamePage;
