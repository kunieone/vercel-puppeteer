"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const browser_1 = require("./browser");
const logger_1 = require("./logger");
// async function main() {
//   let gobalCount = 1;
//   const browser = await getBrowser();
//   let info = await getMyInfo(browser);
//   if (info.message === "账号未登录") {
//     await loginBilibili(browser);
//   }
//   logger.info("任务轮转:" + gobalCount);
//   await workFlow("推送视频", async () => await pushWork(browser));
//   await workFlow("重发视频", async () => await rePushWork(browser));
//   await workFlow("推送剧情树", async () => await pushTreeWork(browser));
//   await workFlow("推广评论", async () => await toOthersCommentWork(browser));
//   await workFlow("个人评论", async () => await toSelfCommentWork(browser));
//   gobalCount++;
//   await browser.close();
// }
async function cnMain() {
    await fs_1.default.promises.mkdir("public", { recursive: true });
    await fs_1.default.promises.writeFile("public/index.html", '<img src="/image.png">');
    //   let info = await getMyInfo(browser);
    const browser = await (0, browser_1.getBrowser)();
    const page = await browser.newPage();
    //   await page.setViewport({
    //     width: 400,
    //     height: 400,
    //     deviceScaleFactor: 1
    //   });
    await page.goto("https://passport.bilibili.com/login", {
        waitUntil: "networkidle2",
    });
    await page.screenshot({ path: "public/image.png" });
    await browser.close();
}
cnMain();
// main();
const workFlow = async (taskName, asyncFunc) => {
    try {
        console.log(ansi_colors_1.default.cyan(taskName), "start");
        await asyncFunc();
        logger_1.logger.info(taskName + "success");
    }
    catch (err) {
        logger_1.logger.warn(taskName + "err");
        console.log(err);
    }
};
