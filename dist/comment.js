"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOthersComment = exports.toMyselfComment = exports.State = void 0;
const api_1 = require("./api");
const utils_1 = require("./utils");
// 发在自己视频的广告 首先看置顶有没有是自己的，如果有，直接跳过，否则发消息，然后检查
var State;
(function (State) {
    State["\u91CD\u590D"] = "repeat";
    State["\u6210\u529F"] = "true";
    State["\u5931\u8D25"] = "false";
})(State = exports.State || (exports.State = {}));
async function toMyselfComment(myMid, browser, bvid, msg) {
    let top = await (0, api_1.getTopCommentInfo)(browser, bvid, api_1.Mode.time);
    if (top.length >= 1 && top[0].mid == myMid) {
        return State.重复;
    }
    await sendMsg(browser, bvid, msg, { top: true });
    return await checkSend(browser, bvid, msg);
}
exports.toMyselfComment = toMyselfComment;
// 发在其他视频的广告
async function toOthersComment(browser, bvid, msg) {
    let isSended = await checkSend(browser, bvid, msg);
    // 此时如果出现类似评论，说明已经评论过了！
    if (isSended === State.成功) {
        return State.重复;
    }
    await sendMsg(browser, bvid, msg);
    return checkSend(browser, bvid, msg);
}
exports.toOthersComment = toOthersComment;
// 发送内容！
const sendMsg = async (browser, bvid, msg, option = { top: false }) => {
    let page = await browser.newPage();
    await page.goto(`https://www.bilibili.com/video/${bvid}`);
    await page.waitForSelector('.reply-box-textarea');
    const text = await page.$('.reply-box-textarea');
    await text.type(msg);
    await page.waitForTimeout(1000);
    await page.waitForSelector('.send-text');
    await page.click('.send-text');
    await page.waitForTimeout(1000);
    // console.log(`已发送！`)
    let isSuccess = await checkSend(browser, bvid, msg);
    // console.log(isSuccess)
    if (option.top) {
        await clickToTop(page);
    }
    await page.close();
    return isSuccess;
};
// 检查发送是否成功 / 看看之前有没有在这个地方发过推广
const checkSend = async (browser, bvid, msg) => {
    let newList = await (0, api_1.getCommentInfo)(browser, bvid, api_1.Mode.time);
    let max = 0;
    newList.forEach((v) => {
        let sim = (0, utils_1.similar)(msg, v, 2);
        // console.log({ bvid, sim, v })
        max = Math.max(max, sim);
    });
    return max > 70 ? State.成功 : State.失败;
};
// 点击发的评论到置顶
const clickToTop = async (page) => {
    try {
        await page
            .waitForSelector('.root-reply')
            .then((e) => e?.$('.root-reply'))
            .then((v) => v?.hover());
        await page.waitForTimeout(500);
        await page.click('.reply-operation');
        await page.waitForSelector('.operation-list');
        await page.click('li.operation-option');
        // console.log(`置顶成功！`)
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
};
