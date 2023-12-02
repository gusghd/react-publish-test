import consoleComp from "hh-kr-test3";

import Test1 from "./test1";
import Plugins from "./plugins";

export default {
console: consoleComp(),

  test1: Test1(),
  plugins: Plugins(),
} as { [key: string]: JSX.Element };
