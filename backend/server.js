const express = require("express");
const mysql = require("mysql2");
const { spawn } = require("child_process");
const multer = require("multer");
const cors = require("cors"); // Import CORS
const upload = multer(); // Configure multer for file uploads
const app = express();
const port = 5000;
const pdf = require("pdf-parse");

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this origin
  })
);
app.use(express.json());

const connection = mysql.createConnection({
  host: "triviaai.cbaa242mwb6t.us-east-1.rds.amazonaws.com",
  user: "admintriv",
  password: "devzic-hamwe6-cUnpod",
  database: "trivai",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to RDS:", err);
    process.exit(1);
  } else {
    console.log("Connected to RDS database");
  }
});

function runPythonScript(pdfText, numQuestions) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [
      "./quizGenerator.py",
      pdfText,
      numQuestions,
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}: ${errorOutput}`);
      } else {
        console.log("Raw output from Python script:", output); // Log the raw output
        try {
          const result = JSON.parse(output); // Assuming the output is JSON
          resolve(result);
        } catch (e) {
          reject(`Failed to parse output: ${e}`);
        }
      }
    });
  });
}

app.post("/app/game/login", (req, res) => {
  const { email, userid } = req.body;

  const query = "SELECT * FROM login WHERE email = ? AND userid = ?";

  connection.execute(query, [email, userid], (err, results) => {
    if (err) {
      console.error("Error checking data: " + err.stack);
      return res.status(500).json({ error: "Error checking data" });
    }
    if (results.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });
});

app.post("/api/game/generate", upload.array("documents"), (req, res) => {
  const numQuestions = req.body.numQuestions; // Get the number of questions
  const files = req.files; // Get the uploaded files

  if (files.length > 0) {
    const fileBuffer = files[0].buffer; // Get the buffer of the first file

    pdf(fileBuffer)
      .then((data) => {
        const text = data.text; // Extracted text from the PDF
        runPythonScript(text, numQuestions) // Pass the extracted text to the Python script
          .then((result) => {
            console.log("Python script output:", result); // Log the output
            res.status(200).send({ data: result });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ error: "Failed to generate quiz." });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ error: "Failed to process the file." });
      });
  } else {
    res.status(400).send({ error: "No files uploaded." });
  }
});

app.post("/api/game/create", (req, res) => {
  const { game, gameId } = req.body;

  // Log the incoming data
  console.log("Game data:", game);
  console.log("Game ID:", gameId);

  const game_query =
    "INSERT INTO game (questions, document, ownerId, code) values (?,?,?,?)";

  connection.execute(
    game_query,
    [game.questions, game.document, game.ownerId, gameId],
    (err, results) => {
      if (err) {
        console.error("Error checking data: " + err.stack);
        return res.status(500).json({ error: "Error checking data" });
      }
      console.log("yay");
    }
  );
  const questionOne = game.questions[0];
  const questionDisplay = {
    text: questionOne.question,
    options: questionOne.options,
  };
  console.log(questionDisplay);
  const gameState_query =
    "INSERT INTO gameState (questionIndex, userStatuses, ownerId, code, questionDisplay, status) values (0, ?, ?, ?, ?, ?)";
  connection.execute(
    gameState_query,
    [JSON.stringify([]), game.ownerId, gameId, JSON.stringify(questionDisplay), "idle"],
    (err, results) => {
      if (err) {
        console.error("Error checking data: " + err.stack);
        return res.status(500).json({ error: "Error checking data" });
      }
      console.log("works");
      res.status(200).json({ success: true });
    }
  );
});

app.post("/api/game/join", (req, res) => {
  const { name, userId, gameId } = req.body;
  const check_query = "SELECT * FROM gameState WHERE code = ?";
  connection.execute(check_query, [gameId], (err, results) => {
    if (err) {
      console.error("Error checking data: " + err.stack);
      return res.status(500).json({ error: "Error checking data" });
    } else if (results.rows == 1) {
      console.log("True");
    } else {
      return "Error occured";
    }
  }); /*
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }*/
  const userState = {
    userId: userId,
    lifePoints: 8000,
    answer: null,
    name: name,
    answerTime: null,
  };
  const newPlayerGsQuery = "SELECT userStatuses from gameState WHERE code = ?";
  let ret = "";
  connection.execute(newPlayerGsQuery, [gameId], (err, results) => {
    if (err) {
      console.error("Error checking data: " + err.stack);
      return res.status(500).json({ error: "Error checking data" });
    }
    let userStatuses = Object.values(results[0].userStatuses) || [];
    userStatuses.push(userState);
    const updateQuery = "UPDATE gameState SET userStatuses = ? WHERE code = ?";
    connection.execute(
      updateQuery,
      [JSON.stringify(userStatuses), gameId],
      (err, updateResults) => {
        if (err) {
          console.error("Error updating data: " + err.stack);
          return res.status(500).json({ error: "Error updating data" });
        }
        return res.status(200).json({ success: true, userId: userId });
      }
    );
  });
  //gets player_name and code. If it exists, add them to the room
});

app.post("/api/game/updateAnswer", (req, res) => {
  const { userId, answer, gameId, answerTime } = req.body;
  const updatePlayerAnswerQuery =
    "SELECT userStatuses from gameState WHERE code = ?";
  let temp = "";
  connection.execute(updatePlayerAnswerQuery, [gameId], (err, res) => {
    if (err) {
      console.error("Error checking data: " + err.stack);
      return res.status(500).json({ error: "Error checking data" });
    }
    let userStatuses = Object.values(results[0].userStatuses) || [];
    const user = userStatuses.find((user) => user.userId === userId);
    if (user) {
      user.answer = answer;
      user.answerTime = answerTime;
    }
    const updateQuery = "UPDATE gameState SET userStatuses = ? WHERE code = ?";
    connection.execute(
      updateQuery,
      [JSON.stringify(userStatuses), gameId],
      (err, updateResults) => {
        if (err) {
          console.error("Error updating data: " + err.stack);
          return res.status(500).json({ error: "Error updating data" });
        }
        return res.status(200).json({ success: true, userId: userId });
      }
    );
  });
});

app.post("/api/game/updateCompletionTime", (req, res) => {
    const {gameId, completionTime } = req.body;
      const updateQuery = "UPDATE gameState SET completionTime = ? WHERE code = ?";
      connection.execute(
        updateQuery,
        [completionTime, gameId],
        (err, updateResults) => {
          if (err) {
            console.error("Error updating data: " + err.stack);
            return res.status(500).json({ error: "Error updating data" });
          }
          return res.status(200).json({ success: true });
        }
      );
    });

app.post("/api/game/updateQuestionIndex", (req, res) => {
    const {gameId} = req.body;
    const getGameStateQuery = "SELECT * FROM gameState WHERE code = ?"; // Query to get the game state
    connection.execute(getGameStateQuery, [gameId], (err, results) => {
      if (err) {
        console.error("Error fetching game state: " + err.stack);
        return res.status(500).json({ error: "Error fetching game state" });
      }
  
      if (results.length > 0) {
        gameState = results[0];
        gameState.questionIndex++;
        const getGameStateQuery = "SELECT * FROM game WHERE code = ?"; // Query to get the game state
        connection.execute(getGameStateQuery, [gameId], (err, results) => {
            if (err) {
              console.error("Error fetching game state: " + err.stack);
              return res.status(500).json({ error: "Error fetching game state" });
            }
            const question = results[0].questions[gameState.questionIndex];
            gameState.questionDisplay = {"options":question.options, "text":question.text}
        });
        const updateQuery = "UPDATE gameState SET (questionDisplay,questionIndex) = (?,?) WHERE code = ?"
        connection.execute(updateQuery, [gameState.questionDisplay,gameState.questionIndex,gameId], (err,results2) => {
            if (err) {
                console.error("Error fetching game state: " + err.stack);
                return res.status(500).json({ error: "Error fetching game state" });
              }
        })
        console.log(gameState);
        res.status(200).json({ success: true, gameState: gameState }); // Return the game state
      } else {
        res.status(404).json({ success: false, message: "Game not found" }); // Handle case where game is not found
      }
    });
    });

app.post("/api/game/updateCorrectAnswer", (req, res) => {
    const {gameId} = req.body;
        const getGameStateQuery = "SELECT * FROM gameState WHERE code = ?"; // Query to get the game state
        connection.execute(getGameStateQuery, [gameId], (err, results) => {
            if (err) {
              console.error("Error fetching game state: " + err.stack);
              return res.status(500).json({ error: "Error fetching game state" });
            }
            const gameState = results[0];
            const correctAnswer = gameState.correctAnswer;
            let newAnswer;
            if (correctAnswer !== undefined) {
                newAnswer = undefined;
                gameState.correctAnswer = undefined;
            } else {
                const getGameQuery = "SELECT * FROM game WHERE code = ?";
                connection.execute(getGameQuery, [gameId], (err, gameResults) => {
                    if (err) {
                      console.error("Error fetching game state: " + err.stack);
                      return res.status(500).json({ error: "Error fetching game state" });
                    } else {
                        newAnswer = gameResults[0].questions[index].correctAnswer;
                        gameState.correctAnswer = newAnswer;
                    }
                    
                })
            }
            const setAnswerQuery = "UPDATE gameState SET correctAnswer = $ WHERE code = $"
                connection.execute(setAnswerQuery, [newAnswer,gameId], (err,results) => {
                    if (err) {
                        console.error("Error fetching game state: " + err.stack);
                        return res.status(500).json({ error: "Error fetching game state" });
                    } else {
                        return res.status(200).json({'success':true,"data":gameState})
                    }
                })
            
        });
    });

app.get("/api/game/gameState/:gameId", (req, res) => {
  const gameId = req.params.gameId; // Get the gameId from the URL parameters

  const getGameStateQuery = "SELECT * FROM gameState WHERE code = ?"; // Query to get the game state
  connection.execute(getGameStateQuery, [gameId], (err, results) => {
    if (err) {
      console.error("Error fetching game state: " + err.stack);
      return res.status(500).json({ error: "Error fetching game state" });
    }

    if (results.length > 0) {
      gameState = results[0];
      gameState.userStatuses = Object.values(results[0].userStatuses) || [];
      console.log(gameState);
      res.status(200).json({ success: true, gameState: gameState }); // Return the game state
    } else {
      res.status(404).json({ success: false, message: "Game not found" }); // Handle case where game is not found
    }
  });
});

app.post("/api/game/start", (req, res) => {
  const { gameId } = req.body;
  const getGameStateQuery = "SELECT * FROM gameState WHERE code = ?"; // Query to get the game state
  connection.execute(getGameStateQuery, [gameId], (err, results) => {
    if (err) {
      console.error("Error fetching game state: " + err.stack);
      return res.status(500).json({ error: "Error fetching game state" });
    }

    if (results.length > 0) {
      gameState = results[0];
      gameState.userStatuses = Object.values(results[0].userStatuses) || [];
      gameState.status = "active";
      const updateGsQuery = "UPDATE gameState SET status = ? WHERE code = ?";
      connection.execute(
        updateGsQuery,
        ["active", gameId],
        (err, updateResults) => {
          if (err) {
            console.error("Error updating data: " + err.stack);
            return res.status(500).json({ error: "Error updating data" });
          }
        }
      );
      console.log(gameState)
      res.status(200).json({ success: true, gameState: gameState }); // Return the game state
    } else {
      res.status(404).json({ success: false, message: "Game not found" }); // Handle case where game is not found
    }
  });
});

app.post("/api/game/end", (req, res) => {
    const { gameId } = req.body;
    const getGameStateQuery = "SELECT * FROM gameState WHERE code = ?"; // Query to get the game state
    connection.execute(getGameStateQuery, [gameId], (err, results) => {
      if (err) {
        console.error("Error fetching game state: " + err.stack);
        return res.status(500).json({ error: "Error fetching game state" });
      }
  
      if (results.length > 0) {
        gameState = results[0];
        gameState.userStatuses = Object.values(results[0].userStatuses) || [];
        gameState.status = "completed";
        const updateGsQuery = "UPDATE gameState SET status = ? WHERE code = ?";
        connection.execute(
          updateGsQuery,
          ["completed", gameId],
          (err, updateResults) => {
            if (err) {
              console.error("Error updating data: " + err.stack);
              return res.status(500).json({ error: "Error updating data" });
            }
          }
        );
        console.log(gameState)
        res.status(200).json({ success: true, gameState: gameState }); // Return the game state
      } else {
        res.status(404).json({ success: false, message: "Game not found" }); // Handle case where game is not found
      }
    });
  });

  

app.post("/api/game/endQuestion", (req, res) => {
  const { gameId, correctAnswer } = req.body;
  const getAnswerQuery = "SELECT questions from game WHERE code = ?";
  connection.execute(getAnswerQuery, [gameId], (err, res) => {
    if (err) {
      console.error("Error updating data: " + err.stack);
      return res.status(500).json({ error: "Error updating data" });
    }
    let questions = JSON.parse(results[0].questions);
    let correctAnswerNumber = questions[questionIndex].answers;
    let correctAnswer = questions[questionIndex].options[correctAnswerNumber];
    const getUserStatuses = "SELECT * from gameState WHERE code = ?";
    connection.execute(getUserStatuses, [gameId], (err, gameState) => {
      if (err) {
        console.error("Error updating data: " + err.stack);
        return res.status(500).json({ error: "Error updating data" });
      }

      let correctPlayers = [];

      let userStates = gameState[0].userStatuses.map((user) => {
        if (user.answer != correctAnswerNumber) {
          user.lifePoints -= 1000;
        } else {
          correctPlayers.append(user);
        }
      });
      correctPlayers.sort((a, b) => a.answerTime - b.answerTime);
      const numPlayers = userStates.length(); //HERE
      for (let i = 0; i < correctPlayers.length(); i++) {
        let user = userStates.find(
          (user) => user.name === correctPlayers[i].name
        );
        user.lifePoints =
          user.lifePoints - 500 * float((i - 1) / (numPlayers - 1));
      }
      userStates.sort((a, b) => a.lifePoints - b.lifePoints);
      for (let j = 0; j < userStates.length(); j++) {
        userStates[j].rank = j + 1;
      }
      gameState[0].userStatuses = userStates;
      return { correctAnswer: correctAnswer, gameState: gameState[0] };
    });
  });
});

app.post("/api/game/cancel", (req,res) => {
    const { gameId } = req.body;
    const updateQuery = "DELETE FROM gameState WHERE code = ?";
    connection.execute(
        updateQuery,
        [gameId],
        (err, results) => {
          if (err) {
            console.error("Error updating data: " + err.stack);
            return res.status(500).json({ error: "Error updating data" });
          }
          return res.status(200).json({ success: true });
        }
      );
})
// app.post('/api/game/')

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
