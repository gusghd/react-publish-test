import React from "react";
import { Link } from "react-router-dom";

import AppRouter from "./routes/router";

function HHTestApp() {
  return (
    <div className={"App"}>
      {/* <h1>테스트1111</h1> */}
      <header>
        <Link to="/console/test1">테스트1</Link>
        <Link to="/console/test2">테스트2</Link>
      </header>
      <AppRouter></AppRouter>
    </div>
  );
}

export default HHTestApp;
