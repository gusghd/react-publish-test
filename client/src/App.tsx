import React, { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import AppRouter from "./router";

function App() {
  const [menus, setMenus] = useState<
    { name: string; url: string; menuId: string }[]
  >([]);

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
        <AppRouter menus={menus}></AppRouter>
      </div>
    </BrowserRouter>
  );
}

export default App;
