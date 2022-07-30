import { Browser, ElementHandle, Page } from 'puppeteer'
import { getAlmostDoneList } from './api'
import { cocurrent } from './utils'

// 获得已经投稿成功但是没有添加剧情的
export async function pushTreeWork(
    browser: Browser,
    taskName: string = '任务'
) {
    console.log(1)

    let bvids: string[] = await getAlmostDoneList(browser)
    if (bvids.length === 0) {
        console.log(`没有需要推送剧情树的视频！`)
        return false
    }
    console.log(`总共${bvids.length}个视频！`)
    let res: boolean = await cocurrent(
        taskName,
        bvids,
        async (bvid) => {
            let page = await browser.newPage()
            await page.goto(
                'https://member.bilibili.com/studio/worldline-editor?bvid=' +
                    bvid,
                { waitUntil: 'load' }
            )
            page.setDefaultTimeout(160 * 1000)
            await page.waitForSelector('canvas')
            await page.waitForTimeout(1000)
            await page.mouse.click(478, 240)

            await autoClickTill(page, 874, 465, {
                range: 40,
                till: '.ivu-select-input',
            })

            await page.waitForSelector('.simplebar-content-wrapper')
            await page.mouse.click(857, 466)
            await page.waitForSelector(
                `[placeholder="请输入此模块的剧情名称..."]`
            )
            await page.evaluate(() => {
                let v: any = document.querySelector(
                    '[placeholder="请输入此模块的剧情名称..."]'
                )
                v.value = ''
            })
            await page.type(
                '.setting-section__body .ivu-input,ivu-input-default',
                '三连+关注，步非烟18x合集，私！'
            )
            await page.click('.ivu-select-input')
            let items = await page.$$('.ivu-select-item') //选中子内容
            await items[0].click()
            await page.waitForTimeout(200)

            await page.mouse.move(1627, 106)
            await page.mouse.click(1627, 106)
            await page.mouse.move(1627, 35)
            await page.mouse.click(1627, 35)
            await page.waitForTimeout(2000)
            await page.close()
        },
        async () => false
    )
    return res
}

// (async () => {
//   let browser = await getBrowser();
//   await pushTree(browser);
// })();
export async function autoClickTill(
    page: Page,
    x: number,
    y: number,
    options: { range: number; till: string }
) {
    let gc = 0
    let c = setInterval(async () => {
        let ran = () =>
            Math.floor(Math.random() * (2 * options.range)) - options.range
        await page.mouse.click(x + ran(), y + ran())
        gc += 100
        if (gc >= 30 * 100 * 10) {
            gc = 0
            console.log(`点不到!`)
            clearInterval(c)
            await page.waitForTimeout(1000)
            await page.reload()
            await autoClickTill(page, x, y, options)
        }
    }, 100)

    await page.waitForSelector(options.till)
    clearInterval(c)
}

export async function autoClickElementTill(
    page: Page,
    element: ElementHandle,
    options: { till: string }
) {
    let gc = 0
    let c = setInterval(async () => {
        await element.click()
        gc += 10
        if (gc >= 10 * 1000) {
            console.log(`点不到!`)
            clearInterval(c)
            await page.waitForTimeout(1000)
            await page.reload()
            await autoClickElementTill(page, element, options)
        }
    }, 100)
    await page.waitForSelector(options.till)
    clearInterval(c)
}
