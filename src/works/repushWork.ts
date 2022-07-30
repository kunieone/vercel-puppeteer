/* 重新投稿 */
import { Browser, Page } from 'puppeteer'
import { getProlemList } from '../api'
import config from '../config'
import {
    addTitles,
    cleanTitle,
    clearGlobalModal,
    clickUploadBtn,
    deleteProblemVideos,
    genUploadProgressBar,
    getFrame,
    getRanVideoTitle,
    upload,
    writeTitle,
} from './utils/push'
export async function rePushWork(browser: Browser) {
    let problemList = await getProlemList(browser)
    console.log('有问题的作品个数:', problemList.length)

    for (let i = 0; i < problemList.length; i++) {
        let page = await browser.newPage()
        page.setDefaultTimeout(600 * 1000)
        const bvid = problemList[i]
        await rePublishSingle(page, bvid)
        await page.close()
    }
}

async function rePublishSingle(page: Page, bvid: string) {
    let { video, title } = getRanVideoTitle()
    const url =
        'https://member.bilibili.com/platform/upload/video/interactive' +
        '?type=edit&bvid=' +
        bvid
    await page.goto(url, { waitUntil: 'networkidle2' })
    const frame = await getFrame(page, 'videoUpload')

    await deleteProblemVideos(page)
    await upload(page, frame, [
        config.video_dir + video,
        config.ph_dir + '1.mp4',
        config.ph_dir + '2.mp4',
    ])
    await addTitles(page, frame)
    await cleanTitle(frame)
    await writeTitle(frame, title)
    await clickUploadBtn(frame)
    let c = await genUploadProgressBar(page, frame)
    await page.waitForNetworkIdle()
    clearInterval(c)
    await page.waitForTimeout(4000)
}
