import _ from "lodash";
import fs from "fs";
import colors from "ansi-colors";

import { getBrowser } from "./browser";
import { pushWork } from "./works/pushWork";
import { pushTreeWork } from "./pushTreeWork";
import { toOthersCommentWork } from "./works/toOthersCommentWork";
import { toSelfCommentWork } from "./works/toSelfCommentWork";
import { rePushWork } from "./works/repushWork";
import { logger } from "./logger";
import { getMyInfo } from "./api.js";
import { loginBilibili } from "./utils.js";

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
  await fs.promises.mkdir("public", { recursive: true });
  await fs.promises.writeFile("public/index.html", '<img src="/image.png">');

  //   let info = await getMyInfo(browser);
  const browser = await getBrowser();

  const page = await browser.newPage();

  //   await page.setViewport({
  //     width: 400,
  //     height: 400,
  //     deviceScaleFactor: 1
  //   });

  await page.goto("https://bilibili.com", { waitUntil: "networkidle2" });
  await page.screenshot({ path: "public/image.png" });
  await browser.close();
}
cnMain();
// main();

const workFlow = async (taskName: string, asyncFunc: Function) => {
  try {
    console.log(colors.cyan(taskName), "start");
    await asyncFunc();
    logger.info(taskName + "success");
  } catch (err) {
    logger.warn(taskName + "err");
    console.log(err);
  }
};
