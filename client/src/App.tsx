import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Link } from "react-router-dom";
import AppRouter from "./routes/router";

function App() {
  const [menus, setMenus] = useState<{ name: string; url: string }[]>([]);

  const getMenu = async () => {
    const res = await fetch("/api/getMenu");
    const data = await res.json();
    console.log(data);
    setMenus(data);
  };

  React.useEffect(() => {
    getMenu();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <header>
          {menus.map((menu) => (
            <Link to={menu.url}>{menu.name}</Link>
          ))}
          {/* <Link to="/test11">테스트3</Link>
          <Link to="/test2">테스트4</Link>
          <Link to="/plugins">플러그인 설치</Link> */}
        </header>
        <AppRouter></AppRouter>
      </div>
    </BrowserRouter>
  );
}

export default App;
