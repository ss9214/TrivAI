import { Typography } from "@mui/material";
import "./UserEnd.css";
import { getLifePoints, getRank } from "../../store/selectors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts"; // Import the RootState type

function UserEnd() {
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

  return (
    <div className="user-end">
      {lifePoints !== null && lifePoints <= 0 ? (
        <Typography variant="h4" style={{ fontWeight: 700 }}>
          You died!
        </Typography>
      ) : (
        <>
          <Typography variant="h4" style={{ fontWeight: 700 }}>
            You survived!
          </Typography>
          {lifePoints !== null && (
            <Typography variant="body1">
              {`Life points remaining: ${lifePoints}`}
            </Typography>
          )}
          {rank !== null && (
            <Typography variant="body1">{`Rank: ${rank}${nth(
              rank
            )}`}</Typography>
          )}
        </>
      )}
    </div>
  );
}

export default UserEnd;
