import { Button, Divider, Typography } from "@mui/material";
import "./GameOptions.css";
import { useState } from "react";

function GameOptions({
  options_text,
  correctAnswer,
}: {
  options_text?: string[];
  correctAnswer?: number;
}) {
  const defaultOptions = ["A", "B", "C", "D"];
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  const selectOption = (index?: number) => () => {
    setSelectedOptionIndex(index ?? null);
  };

  return (
    <>
      {selectedOptionIndex !== null ? (
        <div className="selected-game-option">
          <div className="question-option">
            <Typography variant="h4">
              Waiting for the question to end... <br />
              You selected option {defaultOptions[selectedOptionIndex]}.
            </Typography>
          </div>
        </div>
      ) : (
        <div className="game-options">
          {options_text
            ? options_text.map((option: string, index: number) => (
                <Button
                  key={index}
                  className={
                    correctAnswer !== undefined && correctAnswer !== index
                      ? "question-option-disabled"
                      : "question-option"
                  }
                >
                  <Typography variant="h5" className="default-game-option-text">
                    {defaultOptions[index]}
                  </Typography>
                  <Divider
                    orientation="vertical"
                    flexItem
                    style={{ backgroundColor: "white" }}
                  />
                  <Typography variant="h6" className="game-option-text">
                    {option}
                  </Typography>
                </Button>
              ))
            : defaultOptions.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={selectOption(index)}
                  className="question-option"
                >
                  <Typography variant="h4">{option}</Typography>
                </Button>
              ))}
        </div>
      )}
    </>
  );
}

export default GameOptions;
