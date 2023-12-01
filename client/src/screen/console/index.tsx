import React from "react";
import { Suspense } from "react";

const TestApp = React.lazy(() => import("hh-kr-test3"));

function Test2() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TestApp />
      </Suspense>
    </div>
  );
}

export default Test2;
