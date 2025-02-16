import { Box, Button, Typography } from "@mui/material";
import "./GameEnd.css";
import { useAppSelector } from "../../store/hooks";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useNavigate } from "react-router-dom";

function GameEnd() {
  const navigate = useNavigate();
  const gameState = useAppSelector((state) => state.gameState);
  const topPlayers = gameState?.userStatuses?.slice(0, 3) || [];

  const orderedPlayers = [topPlayers[2], topPlayers[0], topPlayers[1]];

  const heights = [140, 280, 210];

  return (
    <div className="game-end">
      {topPlayers.length > 0 && (
        <Typography fontWeight={700} variant="h4" style={{ margin: "32px" }}>
          {`Congrats, ${topPlayers[0]?.name || "Player"}! You got 1st place!`}
        </Typography>
      )}
      <div className="game-end-info">
        <div className="leaderboard">
          {orderedPlayers.map((player, index) => {
            if (!player) return null;
            return (
              <div className="leaderboard-bar" key={player.name}>
                {index === 1 && <EmojiEventsOutlinedIcon fontSize="large" />}
                <Typography fontWeight={700}>{player.name}</Typography>
                <Box
                  height={heights[index]}
                  width={100}
                  className="leaderboard-bar-box"
                >
                  <Typography fontWeight={700} style={{ color: "white" }}>
                    {index === 0 ? 3 : index === 1 ? 1 : 2}
                  </Typography>
                </Box>
              </div>
            );
          })}
        </div>
        <Button
          variant="outlined"
          sx={{
            height: "40px",
            backgroundColor: "#1e293b !important",
            color: "white !important",
            marginLeft: "20px",
          }}
          onClick={() => navigate("/")}
        >
          Exit
        </Button>
      </div>
    </div>
  );
}

export default GameEnd;
