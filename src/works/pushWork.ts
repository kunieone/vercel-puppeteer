/* 发布视频 */
import { Browser } from 'puppeteer'
import { retry } from '../utils'
import config from '../config'
import {
    addTitles,
    cleanTitle,
    // clearGlobalModal,
    clickModal,
    clickUploadBtn,
    genUploadProgressBar,
    getFrame,
    getRanVideoTitle,
    upload,
    writeTitle,
} from './utils/push'
export const pushWork = async (browser: Browser) => {
    let { video, title } = getRanVideoTitle()
    let p = await browser.newPage()
    // 把默认的延迟时间设置成600秒
    await p.goto(
        'https://member.bilibili.com/platform/upload/video/interactive',
        { waitUntil: 'networkidle2' }
    )
    await p.waitForNetworkIdle()
    const frame = await getFrame(p, 'videoUpload')
    await upload(p, frame, [
        config.video_dir + video,
        config.ph_dir + '1.mp4',
        config.ph_dir + '2.mp4',
    ])

    await retry(20, async () => await addTitles(p, frame))
    await p.screenshot({ path: 'screen/retry.png' })
    await retry(20, async () => await clickModal(frame))
    // await clickModal(frame)
    console.log('跳出')

    await cleanTitle(frame)
    console.log('cleanTitle')

    await writeTitle(frame, title)
    console.log('writeTitle')

    await clickUploadBtn(frame)
    console.log('clk')

    let c = await genUploadProgressBar(p, frame)
    console.log(`bar`)
    await p.screenshot({ path: 'screen/waitForNetworkIdle.png' })
    await p.waitForNetworkIdle()
    console.log(`1`)

    clearInterval(c)
    await p.waitForTimeout(4000)
    await p.close()
}
