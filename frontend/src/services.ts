import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getGameState = async (gameId: string) => {
  try {
    const response = await api.get(`/game/gameState/${gameId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting game state:", error);
    throw error;
  }
};

export const gameStateStart = async (gameId: string) => {
  try {
    const response = await api.post("/game/start", { gameId });
    return response.data;
  } catch (error) {
    console.error("Error starting game:", error);
    throw error;
  }
};

export const gameStateCancel = async (gameId: string) => {
  try {
    const response = await api.post("/game/cancel", { gameId });
    return response.data;
  } catch (error) {
    console.error("Error canceling game:", error);
    throw error;
  }
};

export const gameStateEnd = async (gameId: string) => {
  try {
    const response = await api.post("/game/end", { gameId });
    return response.data;
  } catch (error) {
    console.error("Error ending game:", error);
    throw error;
  }
};

export const setCorrectAnswer = async (gameId: string) => {
  try {
    const response = await api.post("/game/updateCorrectAnswer", { gameId });
    return response.data;
  } catch (error) {
    console.error("Error ending game:", error);
    throw error;
  }
};

export const nextQuestion = async (gameId: string) => {
  try {
    const response = await api.post("/game/endQuestion", { gameId });
    return response.data;
  } catch (error) {
    console.error("Error ending game:", error);
    throw error;
  }
};

export const setCompletionTime = async (
  gameId: string,
  completionTime: Date
) => {
  try {
    const response = await api.post("/game/updateCompletionTime", {
      gameId,
      completionTime,
    });
    return response.data;
  } catch (error) {
    console.error("Error ending game:", error);
    throw error;
  }
};
