import { Typography } from "@mui/material";
import "./QuestionResult.css";

function QuestionResult({ correctAnswer }: { correctAnswer: number }) {
  const answer = 0;
  const lifePoints = 5500;
  return (
    <div className="game-waiting">
      <Typography variant="h4">
        {answer === correctAnswer
          ? "You got the question correct!"
          : "You got the question incorrect..."}{" "}
      </Typography>
      <Typography variant="body1">
        {lifePoints} life points remaining
      </Typography>
    </div>
  );
}

export default QuestionResult;
