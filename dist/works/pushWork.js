"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushWork = void 0;
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../config"));
const push_1 = require("./utils/push");
const pushWork = async (browser) => {
    let { video, title } = (0, push_1.getRanVideoTitle)();
    let p = await browser.newPage();
    // 把默认的延迟时间设置成600秒
    await p.goto('https://member.bilibili.com/platform/upload/video/interactive', { waitUntil: 'networkidle2' });
    await p.waitForNetworkIdle();
    const frame = await (0, push_1.getFrame)(p, 'videoUpload');
    await (0, push_1.upload)(p, frame, [
        config_1.default.video_dir + video,
        config_1.default.ph_dir + '1.mp4',
        config_1.default.ph_dir + '2.mp4',
    ]);
    await (0, utils_1.retry)(20, async () => await (0, push_1.addTitles)(p, frame));
    await p.screenshot({ path: 'screen/retry.png' });
    await (0, utils_1.retry)(20, async () => await (0, push_1.clickModal)(frame));
    // await clickModal(frame)
    console.log('跳出');
    await (0, push_1.cleanTitle)(frame);
    console.log('cleanTitle');
    await (0, push_1.writeTitle)(frame, title);
    console.log('writeTitle');
    await (0, push_1.clickUploadBtn)(frame);
    console.log('clk');
    let c = await (0, push_1.genUploadProgressBar)(p, frame);
    console.log(`bar`);
    await p.screenshot({ path: 'screen/waitForNetworkIdle.png' });
    await p.waitForNetworkIdle();
    console.log(`1`);
    clearInterval(c);
    await p.waitForTimeout(4000);
    await p.close();
};
exports.pushWork = pushWork;
