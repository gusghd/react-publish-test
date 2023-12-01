const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const ReactDOMServer = require("react-dom/server");
const React = require("react");

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
      clientBuild();
      return;
    }
  );
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
  const plugins = require("../config/plugins");
  const clientPkg = require("../../client/package.json");
  const clientPkgList = Object.keys(clientPkg);

  const needInstallArr = [];
  for (const key in plugins) {
    console.log(plugins[key]);
    if (!clientPkgList.includes(plugins[key]["moduleName"])) {
      needInstallArr.push(plugins[key]["moduleName"]);
    }
  }

  await installPlugin(needInstallArr.join(" "));
};

const init = () => {
  pluginInit();
};

// init();

fs.watchFile(pluginPath, async (curr, prev) => {
  pluginInit();
});

app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("/plugin/upload", (req, res) => {
  try {
    const data = require("../config/plugins");
    console.log(data.console);
    data["console"] = {
      enabled: true,
      displayLabel: "Console",
      moduleName: "hh-kr-test3",
      url: "/console",
    };

    const file = JSON.stringify(data);
    console.log(file);
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
    const data = require("../config/plugins");
    const menu = [{ name: "Plugins", url: "/plugins" }];

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
    const data = require("../config/plugins");
    const menu = [{ name: "Plugins", url: "/plugins" }];

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
      console.log(html);
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
