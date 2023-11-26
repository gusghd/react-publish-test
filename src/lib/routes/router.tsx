import React, { useEffect, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import * as page from "../screen";

const route_list = [
  {
    path: "/test1",
    element: page.test1(),
  },
  {
    path: "/test2",
    element: page.test2(),
  },
];

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const AppRouter = () => {
  return (
    <div>
      <Suspense fallback="로딩중">
        <ScrollToTop />
        <Routes>
          {route_list.map((v, k) => (
            <Route {...v} key={k} />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
