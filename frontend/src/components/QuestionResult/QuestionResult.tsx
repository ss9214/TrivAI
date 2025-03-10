import { Typography } from "@mui/material";
import "./QuestionResult.css";
import { getLifePoints, getRank } from "../../store/selectors";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

function QuestionResult({ correctAnswer }: { correctAnswer: number }) {
  const userId = sessionStorage.getItem("userId");

  const rank = useSelector((state: RootState) =>
    userId ? getRank(userId)(state) : null
  );
  const lifePoints = useSelector((state: RootState) =>
    userId ? getLifePoints(userId)(state) : null
  );
  const nth = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const answer = 0;
  return (
    <div className="question-result">
      <Typography variant="h4">
        {answer === correctAnswer
          ? "You got the question correct!"
          : "You got the question incorrect..."}{" "}
      </Typography>
      <Typography variant="body1">
        {`Life points remaining: ${lifePoints}`}
      </Typography>
      <Typography variant="body1">{`Rank: ${rank}${nth(
        rank ?? -1
      )}`}</Typography>
    </div>
  );
}

export default QuestionResult;
