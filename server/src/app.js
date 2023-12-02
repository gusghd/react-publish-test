import express from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

// const ReactDOMServer = require("react-dom/server");

// const StaticRouter = require("react-router-dom/server");
// console.log("StaticRouter", StaticRouter);
const app = express();
const port = 4000;

const router = express.Router();

const pluginPath = path.join(__dirname, "../config/plugins.json");

const installPlugin = async (moduleName) => {
  console.log("----moduleName---", moduleName);
  exec(
    `cd ../client && yarn add ${moduleName}`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`설치 중 에러 발생: ${error.message}`);
        throw Error(error);
      }
      if (stderr) {
        if (!stderr.startsWith("warning")) {
          console.error(`설치 중 에러 발생2: ${stderr}`);
          throw Error(stderr);
        }
      }
      console.log(`모듈 설치 완료!`);

      await insertPluginInClient();
      console.log(`클라이언트 빌드 시작!`);
      clientBuild();
      return;
    }
  );
};

const insertPluginInClient = async () => {
  try {
    const plugins = await require(pluginPath);

    // 스크린 리스트 파일 경로
    const clientScreenPath = path.join(
      __dirname,
      "../../client/src/screen/index.ts"
    );

    // 스크린 동적 텍스트 추가
    let screens = await fs.promises.readFile(clientScreenPath, "utf-8");
    let importList = ``;
    let exportList = ``;
    for (const key in plugins) {
      const plugin = plugins[key];
      importList = `import ${key}Comp from "${plugin.moduleName}";\n${importList}`;
      exportList = `${key}: ${key}Comp(),\n${exportList}`;
    }
    screens = `${importList}\n${screens.replace(
      `export default {`,
      `export default {\n${exportList}`
    )}`;

    // 파일 업데이트
    await fs.promises.writeFile(clientScreenPath, screens);

    // const clientRouterPath = path.join(
    //   __dirname,
    //   "../../client/src/router.tsx"
    // );
    // let routeFile = await fs.promises.readFile(clientRouterPath, "utf-8");
    // let tempPluginHtml = ``;
    // for (const key in plugins) {
    //   const plugin = plugins[key];
    //   tempPluginHtml = `import ${key}Comp from "${plugin.moduleName}";`;
    // }

    // routeFile = `${tempPluginHtml}\n${routeFile}`;
    // // 파일 업데이트
    // await fs.promises.writeFile(clientRouterPath, routeFile);
    console.log(`파일 수정 완료!`);
  } catch (error) {
    console.error("클라이언트 파일 리드 에러:", error);
  }
};

const clientBuild = async () => {
  console.log("=============start client build==============");
  await exec(`cd ../client && yarn build`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`클라이언트 빌드 중 에러 발생: ${error.message}`);
      throw Error(error);
    }
    if (stderr) {
      if (!stderr.startsWith("warning")) {
        console.error(`클라이언트 빌드 중 에러 발생: ${stderr}`);
        throw Error(stderr);
      }
    }
    console.log(`클라이언트 빌드 완료!`);
    return;
  });
};

const pluginInit = async () => {
  console.log("============== Plugin init ==============");
  const plugins = await require(pluginPath);
  const clientPkg = require("../../client/package.json");
  const clientPkgList = Object.keys(clientPkg["dependencies"]);
  const needInstallArr = [];
  for (const key in plugins) {
    if (!clientPkgList.includes(plugins[key]["moduleName"])) {
      needInstallArr.push(plugins[key]["moduleName"]);
    }
  }
  console.log("needInstallArr", needInstallArr);
  if (needInstallArr.length > 0) {
    await installPlugin(needInstallArr.join(" "));
  }
};

const init = () => {
  pluginInit();
};

// init();

fs.watchFile(pluginPath, async (curr, prev) => {
  console.log("===========Changed plugin==========");
  pluginInit();
});

app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("/plugin/upload", (req, res) => {
  try {
    const data = require(pluginPath);

    data["console"] = {
      enabled: true,
      displayLabel: "Console",
      moduleName: "hh-kr-test3",
      url: "/console",
    };

    const file = JSON.stringify(data);
    fs.writeFile(pluginPath, file, "utf-8", (err) => {
      if (err) {
        console.error("파일 등록중 에러", err);
        return;
      }
    });

    res.json({ success: true });
  } catch (e) {
    console.log("error:", e);
  }
});

app.get("/api/getMenu", (req, res) => {
  try {
    const data = require(pluginPath);
    const menu = [{ name: "Plugins", url: "/plugins", menuId: "plugins" }];

    for (const key in data) {
      if (data[key]["enabled"]) {
        menu.push({
          menuId: key,
          name: data[key].displayLabel,
          url: data[key].url,
        });
      }
    }

    res.json(menu);
  } catch (e) {
    console.log("error:", e);
  }
});

const getMenu = async () => {
  try {
    const data = require(pluginPath);
    const menu = [{ name: "Plugins", url: "/plugins", menuId: "plugins" }];

    for (const key in data) {
      if (data[key]["enabled"]) {
        menu.push({
          menuId: key,
          name: data[key].displayLabel,
          url: data[key].url,
        });
      }
    }

    return menu;
  } catch (e) {
    console.log("error:", e);
  }
};

// app.get("/console", (req, res) => {
//   const App = require("hh-kr-test3");
//   console.log(JSON.stringify(temp));
//   const renderString = ReactDOMServer.renderToString(
//     <StaticRouter location={req.url}>
//       <App />
//     </StaticRouter>
//   );

//   res.send(`
//   <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>test-ssr</title>
// </head>
// <body>
//   <div id="content">${renderString}</div>
// </body>
// </html>`);
// });

app.get("*", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../client/build/index.html"),
    "utf-8",
    async (err, data) => {
      const menus = await getMenu();

      const html = data.replace(
        '<div id="menus"></div>',
        `<div id="menus"><h1>${menus[0].name}<h1></div>`
      );
      res.send(html);
    }
  );
});

// app.get("/", async (req, res) => {
//   const { default: AppA } = await import("hh-kr-test3");
//   const reactApp = ReactDOMServer.renderToString(React.createElement(AppA));

//   res.send(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Express React SSR</title>
//       </head>
//       <body>
//         <div id="app">${reactApp}</div>
//         <script src="bundle.js"></script>
//       </body>
//     </html>
//   `);
// });

// router.get("*", (req, res) => {
//   res.sendFile(index);
// });

// router.post("/send", (req, res) => {
//   //처리로직
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
