import { Typography, Card, CardContent, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PeopleIcon from "@mui/icons-material/People";
import "./GameLobby.css";

function GameLobby() {
  const players = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
  ];
  const totalPlayers = players.length;

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
          Players {`(${totalPlayers})`}
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
          {players.map((player, index) => (
            <Grid size={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{player}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
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
