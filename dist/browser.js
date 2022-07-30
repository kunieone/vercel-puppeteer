"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowser = void 0;
// import { launch } from 'puppeteer'
const config_1 = __importDefault(require("./config"));
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
const puppeteer_1 = require("puppeteer");
let device = config_1.default.device;
async function getBrowser() {
    return await (0, puppeteer_1.launch)(process.env.AWS_EXECUTION_ENV
        ? {
            args: chrome_aws_lambda_1.default.args,
            executablePath: await chrome_aws_lambda_1.default.executablePath,
            headless: chrome_aws_lambda_1.default.headless,
            defaultViewport: { height: 853, width: 1680 },
            userDataDir: config_1.default.data_path,
        }
        : {
            executablePath: device == "mac" ? config_1.default.mac_chrome_path : config_1.default.linux_chrome_path,
            defaultViewport: { height: 853, width: 1680 },
            userDataDir: config_1.default.data_path,
            headless: config_1.default.headless,
            args: device == "linux"
                ? ["--no-sandbox", "--disable-setuid-sandbox"]
                : [],
        });
}
exports.getBrowser = getBrowser;
