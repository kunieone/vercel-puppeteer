"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
setInterval(() => {
    console.log(`send`);
    axios_1.default
        .get('http://api.bilibili.com/x/v2/reply/main?type=1&mode=2&oid=248440672')
        .then((v) => v.data.data.replies.map((v) => v.content.message))
        .then(console.log);
}, 1030);
