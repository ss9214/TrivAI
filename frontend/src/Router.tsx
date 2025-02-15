import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./routes/Root/Root.tsx";
import HomePage from "./routes/HomePage/HomePage.tsx";
import GameCreatePage from "./routes/GameCreatePage/GameCreatePage.tsx";
import GameJoinPage from "./routes/GameJoinPage/GameJoinPage.tsx";
import GamePage from "./routes/GamePage/GamePage.tsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "game",
        element: <Navigate to="/game/join" replace />,
      },
      {
        path: "game/create",
        element: <GameCreatePage />,
      },
      {
        path: "game/join",
        element: <GameJoinPage />,
      },
      {
        path: "game/:id",
        element: <GamePage />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);

export default Router;
