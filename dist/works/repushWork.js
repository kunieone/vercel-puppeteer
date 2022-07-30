"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rePushWork = void 0;
const api_1 = require("../api");
const config_1 = __importDefault(require("../config"));
const push_1 = require("./utils/push");
async function rePushWork(browser) {
    let problemList = await (0, api_1.getProlemList)(browser);
    console.log('有问题的作品个数:', problemList.length);
    for (let i = 0; i < problemList.length; i++) {
        let page = await browser.newPage();
        page.setDefaultTimeout(600 * 1000);
        const bvid = problemList[i];
        await rePublishSingle(page, bvid);
        await page.close();
    }
}
exports.rePushWork = rePushWork;
async function rePublishSingle(page, bvid) {
    let { video, title } = (0, push_1.getRanVideoTitle)();
    const url = 'https://member.bilibili.com/platform/upload/video/interactive' +
        '?type=edit&bvid=' +
        bvid;
    await page.goto(url, { waitUntil: 'networkidle2' });
    const frame = await (0, push_1.getFrame)(page, 'videoUpload');
    await (0, push_1.deleteProblemVideos)(page);
    await (0, push_1.upload)(page, frame, [
        config_1.default.video_dir + video,
        config_1.default.ph_dir + '1.mp4',
        config_1.default.ph_dir + '2.mp4',
    ]);
    await (0, push_1.addTitles)(page, frame);
    await (0, push_1.cleanTitle)(frame);
    await (0, push_1.writeTitle)(frame, title);
    await (0, push_1.clickUploadBtn)(frame);
    let c = await (0, push_1.genUploadProgressBar)(page, frame);
    await page.waitForNetworkIdle();
    clearInterval(c);
    await page.waitForTimeout(4000);
}
