"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlmostDoneList = exports.getPubedList = exports.getProlemList = exports.getTopCommentInfo = exports.getCommentInfo = exports.Mode = exports.getMyInfo = void 0;
const utils_1 = require("./utils");
const getMyInfo = async (browser) => {
    let url = 'https://api.bilibili.com/x/member/web/account';
    let page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
    let innerText = await page.evaluate(() => JSON.parse(document.querySelector('body').innerText));
    await page.close();
    return innerText;
};
exports.getMyInfo = getMyInfo;
// http://api.bilibili.com/x/v2/reply/main
var Mode;
(function (Mode) {
    Mode[Mode["time"] = 2] = "time";
    Mode[Mode["hot"] = 1] = "hot";
})(Mode = exports.Mode || (exports.Mode = {}));
const getCommentInfo = async (browser, bvid, mode) => {
    let url = `http://api.bilibili.com/x/v2/reply/main?type=1&mode=${mode}&oid=` +
        (0, utils_1.bvToAv)(bvid);
    let page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(300);
    let innerText = await page.evaluate(() => JSON.parse(document.querySelector('body').innerText));
    await page.close();
    if (innerText.data?.replies == null) {
        return [];
    }
    return innerText.data.replies.map((v) => v.content.message);
};
exports.getCommentInfo = getCommentInfo;
const getTopCommentInfo = async (browser, bvid, mode) => {
    let url = `http://api.bilibili.com/x/v2/reply/main?type=1&mode=${mode}&oid=` +
        (0, utils_1.bvToAv)(bvid);
    let page = await browser.newPage();
    await page.goto(url);
    let innerText = await page.evaluate(() => JSON.parse(document.querySelector('body').innerText));
    await page.close();
    return innerText.data.top_replies === null ? [] : innerText.data.top_replies;
};
exports.getTopCommentInfo = getTopCommentInfo;
async function getProlemList(browser) {
    let p = await browser.newPage();
    await p.goto('https://member.bilibili.com/x/web/archives?status=not_pubed');
    let innerText = await p.evaluate(() => document.querySelector('pre').innerHTML);
    if (JSON.parse(innerText).data.arc_audits === null)
        return [];
    await p.close();
    return JSON.parse(innerText)
        .data.arc_audits?.filter((v) => v.Archive.state == -2 || v.Archive.state == -16)
        .map((ee) => ee.Archive.bvid);
}
exports.getProlemList = getProlemList;
async function getPubedList(browser) {
    let p = await browser.newPage();
    let value = [];
    for (let pageNumber = 1; pageNumber < 5; pageNumber++) {
        await p.goto('https://member.bilibili.com/x/web/archives?status=pubed&pn=' +
            pageNumber);
        await p.waitForNetworkIdle();
        let innerText = await p.evaluate(() => document.querySelector('pre')?.innerHTML);
        if (JSON.parse(innerText).data['arc_audits'] === null ||
            innerText === undefined)
            break;
        value.push(...JSON.parse(innerText)
            .data.arc_audits.filter((v) => v.Archive.state == 0)
            .map((ee) => ee.Archive.bvid));
    }
    console.log(value);
    return value;
}
exports.getPubedList = getPubedList;
async function getAlmostDoneList(browser) {
    let value = [];
    for (let i = 0; i < 10; i++) {
        let p = await browser.newPage();
        await p.goto('https://member.bilibili.com/x/web/archives?status=is_pubing&pn=' +
            i);
        let innerText = await p.evaluate(() => document.querySelector('pre')?.innerHTML);
        if (JSON.parse(innerText).data['arc_audits'] === null ||
            innerText === undefined)
            break;
        value.push(...JSON.parse(innerText)
            .data.arc_audits.filter((v) => v.Archive.state == -20)
            .map((ee) => ee.Archive.bvid));
        p.close();
    }
    return value;
}
exports.getAlmostDoneList = getAlmostDoneList;
