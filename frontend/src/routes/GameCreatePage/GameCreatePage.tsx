import { useState } from "react";
import { Typography, Button, Slider } from "@mui/material";
//import quizData from './testquiz.json';
import "./GameCreatePage.css";
import { v4 as uuidv4 } from "uuid";

function GameCreatePage() {
  const [documents, setDocuments] = useState<File[]>([]);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [quizData, setQuizData] = useState(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setDocuments(filesArray);
    }
  };

  const handleGenerateQuiz = async () => {
    try {
      const formData = new FormData();
      console.log(documents);
      formData.append("numQuestions", numQuestions.toString());
      documents.forEach((file) => {
        formData.append("documents", file); // Append each file to the FormData
      });

      const response = await fetch("http://localhost:5000/api/game/generate", {
        method: "POST",
        body: formData, // Send the FormData
      });

      if (response.status === 200) {
        const data = await response.json(); // Parse the JSON response
        setQuizData(data.data); // Set the quiz data from the response
        setQuizGenerated(true); // Set quizGenerated to true
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleCreateGame = async () => {
    try {
      const code = Math.random().toString(36).substring(2, 8);
      let uuid;
      if (sessionStorage.getItem("userId")) {
        uuid = sessionStorage.getItem("userId");
      } else {
        uuid = uuidv4();
        sessionStorage.setItem("userId", uuid);
      }
      const response = await fetch("http://localhost:5000/api/game/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: {
            questions: quizData,
            document: documents,
            ownerId: uuid,
          },
          gameId: code,
        }),
      });

      if (response.status === 200) {
        sessionStorage.setItem("gameId", code);
        window.location.href = `/game/${code}`; // Redirect to the game page
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: quizGenerated ? "space-between" : "center",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <div
        className="game-create-container"
        style={{
          flex: 1,
          marginRight: quizGenerated ? "20px" : "0",
          textAlign: quizGenerated ? "left" : "center",
        }}
      >
        <Typography variant="h4" style={{ paddingBottom: "2%" }}>
          Create a Game
        </Typography>
        <label htmlFor="fileInput">
          <Button
            variant="contained"
            component="span"
            style={{ backgroundColor: "#1e293b", paddingTop: "5%" }}
          >
            Choose Files
          </Button>
        </label>
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {documents.length > 0 && (
          <div style={{ textAlign: "center" }}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {documents.map((file, index) => (
                <li key={index}>{"- " + file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div
          style={{ textAlign: "center", paddingBottom: "2%", paddingTop: "1%" }}
        >
          <Typography variant="h6">
            Number of Questions: {numQuestions}
          </Typography>
          <Slider
            value={numQuestions}
            onChange={(event, newValue) => setNumQuestions(newValue as number)}
            aria-labelledby="num-questions-slider"
            min={1}
            max={20}
            valueLabelDisplay="auto"
          />
        </div>
        {documents.length > 0 && (
          <Button
            variant="contained"
            onClick={handleGenerateQuiz}
            style={{ marginBottom: ".25%", backgroundColor: "#1e293b" }}
          >
            Generate Quiz
          </Button>
        )}
      </div>
      {quizGenerated && ( // Quiz preview area
        <div style={{ flex: 1, height: "50%" }}>
          <div className="json-preview">
            <Typography variant="h6">Quiz Preview:</Typography>
            <pre>{JSON.stringify(quizData, null, 2)}</pre>{" "}
            {/* Display the quiz data */}
          </div>
          <div style={{ textAlign: "center", width: "80vh" }}>
            <Button
              variant="contained"
              onClick={handleCreateGame}
              style={{
                marginTop: ".25%",
                marginBottom: "1.5",
                backgroundColor: "#1e293b",
              }}
            >
              Create Game
            </Button>
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}{" "}
            {/* Display error message */}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameCreatePage;
