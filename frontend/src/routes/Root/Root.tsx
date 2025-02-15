import "./Root.css";
import { Outlet } from "react-router-dom";

function Root() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Root;
