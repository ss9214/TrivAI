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
