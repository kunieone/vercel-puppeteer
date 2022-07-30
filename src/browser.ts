// import { launch } from 'puppeteer'
import config from "./config";
import chrome from "chrome-aws-lambda";
import { launch, Browser } from "puppeteer";

let device = config.device;

export async function getBrowser(): Promise<Browser> {
  return await launch(
    process.env.AWS_EXECUTION_ENV
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
          defaultViewport: { height: 853, width: 1680 },
          userDataDir: config.data_path,
        }
      : {
          executablePath:
            device == "mac" ? config.mac_chrome_path : config.linux_chrome_path,
          defaultViewport: { height: 853, width: 1680 },
          userDataDir: config.data_path,
          headless: config.headless,
          args:
            device == "linux"
              ? ["--no-sandbox", "--disable-setuid-sandbox"]
              : [],
        },
  );
}
