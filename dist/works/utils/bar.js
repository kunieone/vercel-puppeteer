"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genBar = void 0;
const bytes_1 = __importDefault(require("bytes"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const parseProgress = (b1b2b3, msgs) => {
    for (let i = 0; i < b1b2b3.length; i++) {
        let bar = b1b2b3[i];
        let msg = msgs[i];
        if (msg == '等待上传') {
            bar.update(0);
        }
        else if (msg == '上传完成') {
            bar.update(bar.getTotal());
        }
        else if (msg.includes('已经上传')) {
            let c = [...msg.matchAll(/[0-9]+\.[0-9]+[A-Z]{2}/g)];
            bar.update((0, bytes_1.default)(c[0][0]) / (0, bytes_1.default)(c[1][0]));
            let now = (0, bytes_1.default)(c[0][0]);
            let total = (0, bytes_1.default)(c[1][0]);
            // console.log(now, total);
            bar.setTotal(total);
            bar.update(now, { va: (0, bytes_1.default)(now), to: (0, bytes_1.default)(total) });
        }
    }
};
// add bars
// ->t 可以用clearInterval清掉
//
function genBar(cb) {
    const multibar = new cli_progress_1.default.MultiBar({
        stopOnComplete: true,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        barsize: 30,
        format: ansi_colors_1.default.cyan('[{bar}]') +
            '视频{i}|{va}/{to}|{percentage}%|{duration_formatted}',
    });
    const b1 = multibar.create(200, 0, { i: 1, va: null, to: null });
    const b2 = multibar.create(200, 0, { i: 2, va: null, to: null });
    const b3 = multibar.create(200, 0, { i: 3, va: null, to: null });
    return setInterval(async () => {
        let array = await cb();
        // console.log({ array });
        parseProgress([b1, b2, b3], array);
    }, 1000);
}
exports.genBar = genBar;
