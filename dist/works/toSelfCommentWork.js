"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSelfCommentWork = void 0;
const api_1 = require("../api");
const utils_1 = require("../utils");
const comment_1 = require("../comment");
async function toSelfCommentWork(browser) {
    let list = await (0, api_1.getPubedList)(browser);
    let myMid = await (0, api_1.getMyInfo)(browser).then((v) => v.data.mid);
    await (0, utils_1.cocurrent)('查看/发送个人评论', list, async (e) => await (0, comment_1.toMyselfComment)(myMid, browser, e, (Math.random() * 10).toFixed(1) +
        '大家不要只跟队形,要三连+关注+斯信拿盒集![大笑]+'));
}
exports.toSelfCommentWork = toSelfCommentWork;
