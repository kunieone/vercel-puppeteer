"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearGlobalModal = exports.deleteProblemVideos = exports.genUploadProgressBar = exports.clickUploadBtn = exports.writeTitle = exports.cleanTitle = exports.clickModal = exports.getFrame = exports.addTitles = exports.upload = exports.getRanVideoTitle = void 0;
const utils_1 = require("../../utils");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../../config"));
const bar_1 = require("./bar");
function getRanVideoTitle() {
    let video = (0, utils_1.rand)(fs_1.default.readdirSync(config_1.default.video_dir).filter((v) => v.endsWith('mp4')), 1)[0];
    let title = config_1.default.video_prefix +
        (0, utils_1.trimTitle)(video).replace(/(【中文音声】)|(^\s*)|(\s*$)|(~)/g, '');
    return { title, video };
}
exports.getRanVideoTitle = getRanVideoTitle;
async function upload(page, frame, files) {
    console.log(`上传视频！`);
    await frame.waitForSelector(`input[type="file"][multiple="true"]`);
    const input = await frame.$(`input[type="file"][multiple="true"]`);
    console.log(1);
    await input.uploadFile(...files);
    console.log(`上传点击完毕!`);
}
exports.upload = upload;
async function addTitles(page, frame) {
    page.setDefaultTimeout(1200 * 1000);
    const list = await frame.$$('.item-title-text');
    for (let i = 0; i < list.length; i++) {
        console.log('第' + i + '个标题');
        await frame.waitForTimeout(100);
        await frame.waitForSelector(`.item-title-text`);
        await list[i].click();
        console.log('ok');
        await frame.waitForSelector('.file-list-v2-item input');
        let input = await frame.$('.file-list-v2-item input');
        console.log({ input });
        await input.press('Backspace', { delay: 1000 });
        // await frame.evaluate(
        //     () =>
        //         `document.querySelector('.file-list-v2-item input').value = ''`
        // )
        await frame.waitForTimeout(100);
        await frame.type('.file-list-v2-item input', new Date().toTimeString().slice(0, 8));
    }
}
exports.addTitles = addTitles;
// 获取frame
async function getFrame(page, name) {
    await page.waitForSelector('iframe');
    return page.frames().find((f) => f._name == name);
}
exports.getFrame = getFrame;
// 点击模版
async function clickModal(frame) {
    console.log('clickModal');
    await frame.click('.template-op');
    console.log('clickModal1');
    // await frame.waitForSelector().then((v) => v.click())
    await frame.waitForTimeout(500);
    console.log('clickModal2');
    // await frame.waitForSelector(
    //     '.template-list-small-container > .template-list-small-item'
    // )
    await frame.click('.template-list-small-container>.template-list-small-item');
    console.log('clickModal3');
}
exports.clickModal = clickModal;
async function cleanTitle(frame) {
    await frame.evaluate(() => "document.querySelector(`.input-box-v2-1-instance>input`).value = ''");
}
exports.cleanTitle = cleanTitle;
async function writeTitle(frame, title) {
    await frame.type(`input[placeholder="请输入稿件标题"]`, title);
    await frame.click('.submit-btn-group-add');
}
exports.writeTitle = writeTitle;
async function clickUploadBtn(frame) {
    await frame.waitForSelector('.submit-btn-group-add');
    await frame.click('.submit-btn-group-add');
}
exports.clickUploadBtn = clickUploadBtn;
async function genUploadProgressBar(page, frame) {
    return (0, bar_1.genBar)(async () => {
        let info = await frame.evaluate(() => {
            let info = [];
            document
                .querySelectorAll('.item-upload-info .upload-status-intro')
                .forEach((v) => {
                info.push(v.innerHTML);
            });
            return info;
        });
        console.log(info);
        return info;
    });
}
exports.genUploadProgressBar = genUploadProgressBar;
// some function used for republish
async function deleteProblemVideos(page) {
    for (let i = 0; i < 5; i++) {
        console.log(i + '次！');
        await page.waitForTimeout(1000);
        await page.mouse.click(1311, 237);
        await page.waitForTimeout(1000);
        await page.mouse.click(1285, 269);
    }
}
exports.deleteProblemVideos = deleteProblemVideos;
async function clearGlobalModal(page) {
    await page.mouse.click(596, 133);
    // return await repeatClick(page, { x: 596, y: 133 }, 3000, 40)
}
exports.clearGlobalModal = clearGlobalModal;
