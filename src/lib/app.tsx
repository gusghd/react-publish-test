import React from "react";
import { BrowserRouter, Link } from "react-router-dom";

import AppRouter from "./routes/router";

function HHTestApp() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <Link to="/test1">테스트1</Link>
          <Link to="/test2">테스트2</Link>
        </header>
        <AppRouter></AppRouter>
      </div>
    </BrowserRouter>
  );
}

export default HHTestApp;
