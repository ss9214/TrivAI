import { Button, Typography } from "@mui/material";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const toCreateJoin = () => {
    navigate("game/create");
  };

  const toGameJoin = () => {
    navigate("game/join");
  };

  return (
    <div className="home-layout">
      <Typography variant="h3">TrivAI</Typography>
      <div className="game-button-options">
        <div>
          <Button
            variant="contained"
            className="game-button"
            style={{backgroundColor:"#1e293b"}}
            onClick={toCreateJoin}
          >
            Create
          </Button>
          <Button
            variant="contained"
            className="game-button"
            style={{backgroundColor:"#1e293b"}}
            onClick={toGameJoin}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
