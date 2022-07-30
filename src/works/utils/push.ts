import { Frame, Page } from 'puppeteer'
import { rand, repeatClick, trimTitle } from '../../utils'
import fs from 'fs'
import config from '../../config'
import { genBar } from './bar'
export function getRanVideoTitle() {
    let video = rand(
        fs.readdirSync(config.video_dir).filter((v) => v.endsWith('mp4')),
        1
    )[0]

    let title =
        config.video_prefix +
        trimTitle(video).replace(/(【中文音声】)|(^\s*)|(\s*$)|(~)/g, '')
    return { title, video }
}

export async function upload(page: Page, frame: Frame, files: string[]) {
    console.log(`上传视频！`)
    await frame.waitForSelector(`input[type="file"][multiple="true"]`)
    const input = await frame.$(`input[type="file"][multiple="true"]`)
    console.log(1)

    await input.uploadFile(...files)
    console.log(`上传点击完毕!`)
}
export async function addTitles(page: Page, frame: Frame) {
    page.setDefaultTimeout(1200 * 1000)
    const list = await frame.$$('.item-title-text')
    for (let i = 0; i < list.length; i++) {
        console.log('第' + i + '个标题')

        await frame.waitForTimeout(100)
        await frame.waitForSelector(`.item-title-text`)
        await list[i].click()
        console.log('ok')

        await frame.waitForSelector('.file-list-v2-item input')
        let input = await frame.$('.file-list-v2-item input')
        console.log({ input })

        await input.press('Backspace', { delay: 1000 })
        // await frame.evaluate(
        //     () =>
        //         `document.querySelector('.file-list-v2-item input').value = ''`
        // )
        await frame.waitForTimeout(100)

        await frame.type(
            '.file-list-v2-item input',
            new Date().toTimeString().slice(0, 8)
        )
    }
}
// 获取frame
export async function getFrame(page: Page, name: string) {
    await page.waitForSelector('iframe')
    return page.frames().find((f: any) => f!._name == name)
}
// 点击模版
export async function clickModal(frame: Frame) {
    console.log('clickModal')
    await frame.click('.template-op')
    console.log('clickModal1')

    // await frame.waitForSelector().then((v) => v.click())
    await frame.waitForTimeout(500)
    console.log('clickModal2')

    // await frame.waitForSelector(
    //     '.template-list-small-container > .template-list-small-item'
    // )
    await frame.click(
        '.template-list-small-container>.template-list-small-item'
    )
    console.log('clickModal3')
}
export async function cleanTitle(frame: Frame) {
    await frame.evaluate(
        () =>
            "document.querySelector(`.input-box-v2-1-instance>input`).value = ''"
    )
}

export async function writeTitle(frame: Frame, title: string) {
    await frame.type(`input[placeholder="请输入稿件标题"]`, title)
    await frame.click('.submit-btn-group-add')
}
export async function clickUploadBtn(frame: Frame) {
    await frame.waitForSelector('.submit-btn-group-add')
    await frame.click('.submit-btn-group-add')
}
export async function genUploadProgressBar(page: Page, frame: Frame) {
    return genBar(async () => {
        let info = await frame.evaluate(() => {
            let info = []
            document
                .querySelectorAll('.item-upload-info .upload-status-intro')
                .forEach((v) => {
                    info.push(v.innerHTML)
                })
            return info
        })
        console.log(info)

        return info
    })
}
// some function used for republish

export async function deleteProblemVideos(page: Page) {
    for (let i = 0; i < 5; i++) {
        console.log(i + '次！')
        await page.waitForTimeout(1000)
        await page.mouse.click(1311, 237)
        await page.waitForTimeout(1000)
        await page.mouse.click(1285, 269)
    }
}

export async function clearGlobalModal(page: Page) {
    await page.mouse.click(596, 133)
    // return await repeatClick(page, { x: 596, y: 133 }, 3000, 40)
}
