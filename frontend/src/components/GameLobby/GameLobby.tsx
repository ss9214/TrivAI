import { Typography, Card, CardContent, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PeopleIcon from "@mui/icons-material/People";
import "./GameLobby.css";
import { useAppSelector } from "../../store/hooks";
import { gameStateCancel, gameStateStart } from "../../services";
import { useDispatch } from "react-redux";
import { setGameState } from "../../store/gameStateSlice";
import { useNavigate } from "react-router-dom";

function GameLobby() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gameState = useAppSelector((state) => state.gameState);
  const gameId = sessionStorage.getItem("gameId");

  const cancelGame = async (gameId: string) => {
    await gameStateCancel(gameId);
    dispatch(setGameState(null));
    navigate("/");
  };

  const startGame = async (gameId: string) => {
    const data = await gameStateStart(gameId);
    dispatch(setGameState(data.gameState));
  };

  return (
    <div className="game-lobby">
      <Typography
        variant="h4"
        style={{ fontWeight: "700", marginBottom: "20px" }}
      >
        Waiting for people to join...
      </Typography>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
      >
        <PeopleIcon style={{ marginRight: "8px" }} />
        <Typography variant="h5" style={{ fontWeight: "700" }}>
          Players {`(${gameState?.userStatuses.length || 0})`}
        </Typography>
      </div>
      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          border: "solid rgba(117, 116, 116, 0.73) 1px",
          borderRadius: "4px",
          overflowY: "auto",
        }}
      >
        <Grid container spacing={2}>
          {gameState?.userStatuses.map((player, index) => (
            <Grid size={4} key={index}>
              <Card variant="outlined">
                <CardContent sx={{ padding: "16px !important" }}>
                  <Typography variant="h6" margin={"auto"}>
                    {player.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={() => gameId && cancelGame(gameId)}
          sx={{
            width: "140px",
            height: "52px",
            margin: "20px 0px 0px 20px",
            backgroundColor: "#1e293b !important",
            color: "white !important",
          }}
        >
          Cancel Game
        </Button>
        <Button
          variant="outlined"
          onClick={() => gameId && startGame(gameId)}
          sx={{
            width: "128px",
            height: "52px",
            margin: "20px 0px 0px 20px",
          }}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default GameLobby;
