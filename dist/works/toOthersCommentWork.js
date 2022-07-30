"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOthersCommentWork = void 0;
const axios_1 = __importDefault(require("axios"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../config"));
const api_1 = require("../api");
const comment_1 = require("../comment");
const lodash_1 = __importDefault(require("lodash"));
const cli_progress_1 = require("cli-progress");
const toOthersCommentWork = async (browser) => {
    const Rank = {
        综合排序: 'totalrank',
        最多点击: 'click',
        最新发布: 'pubdate',
        最多弹幕: 'dm',
        最多收藏: 'stow',
        最多评论: 'scores',
    };
    let myMid = await (0, api_1.getMyInfo)(browser).then((v) => v.data.mid);
    let keyword = (0, utils_1.rand)(config_1.default.key_words, 1)[0];
    console.log({ keyword, myMid });
    let others = await axios_1.default
        .get(encodeURI('http://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=' +
        keyword +
        '&order=' +
        lodash_1.default.sample(Rank)))
        .then((v) => v.data.data.result
        .filter((data) => data.mid !== myMid)
        .map((v) => {
        // console.log(v.author)
        return v.bvid;
    }));
    let stateBar = { repeat: 0, success: 0, fall: 0 };
    let b1 = new cli_progress_1.SingleBar({
        format: '广告发送' +
            '[' +
            ansi_colors_1.default.cyan('{bar}') +
            ']{percentage}% |{value}/{total}|{st}',
        // barCompleteChar: "=",
        // barIncompleteChar: " ",
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: false,
        barsize: 30,
    });
    b1.start(others.length, 0, { st: JSON.stringify(stateBar) });
    for (let i = 0; i < others.length; i++) {
        const e = others[i];
        let state = await (0, comment_1.toOthersComment)(browser, e, lodash_1.default.sample(config_1.default.comments));
        // console.log(state)
        switch (state) {
            case comment_1.State.重复:
                stateBar.repeat++;
                break;
            case comment_1.State.成功:
                stateBar.success++;
                break;
            default:
                stateBar.fall++;
                break;
        }
        b1.increment();
        b1.update({ st: JSON.stringify(stateBar) });
    }
    b1.stop();
    console.log('\n');
    return true;
};
exports.toOthersCommentWork = toOthersCommentWork;
