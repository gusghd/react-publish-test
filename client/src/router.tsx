import React, { useEffect, Suspense, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import page from "./screen";

export const route_list = [
  {
    path: "/test1",
    element: page.test1,
  },
  {
    path: "/plugins",
    element: page.plugins,
  },
];

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

type Props = {
  menus: { name: string; url: string; menuId: string }[];
};

const AppRouter = ({ menus }: Props) => {
  const routeList = useMemo(() => {
    const list = [...route_list];
    menus.forEach((menu) => {
      if (page[menu.menuId]) {
        list.push({
          path: `${menu.url}/*`,
          element: page[menu.menuId] as JSX.Element,
        });
      }
    });
    return list;
  }, [menus]);

  return (
    <div>
      <Suspense fallback="로딩중">
        <ScrollToTop />
        <Routes>
          {routeList.map((v, k) => (
            <Route {...v} key={k} />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
