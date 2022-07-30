//API: GET  http://api.bilibili.com/x/member/web/account
import { Browser } from 'puppeteer'
import { bvToAv } from './utils'

export const getMyInfo = async (browser: Browser) => {
    let url = 'https://api.bilibili.com/x/member/web/account'
    let page = await browser.newPage()
    await page.goto(url, { waitUntil: 'load' })
    let innerText = await page.evaluate(() =>
        JSON.parse(document.querySelector('body')!.innerText)
    )
    await page.close()
    return innerText
}

// http://api.bilibili.com/x/v2/reply/main
export enum Mode {
    time = 2, //时间排行
    hot = 1, //热度排行
}
export const getCommentInfo = async (
    browser: Browser,
    bvid: string,
    mode: Mode
): Promise<string[]> => {
    let url =
        `http://api.bilibili.com/x/v2/reply/main?type=1&mode=${mode}&oid=` +
        bvToAv(bvid)
    let page = await browser.newPage()
    await page.goto(url)
    await page.waitForTimeout(300)

    let innerText = await page.evaluate(() =>
        JSON.parse(document.querySelector('body')!.innerText)
    )

    await page.close()
    if (innerText.data?.replies == null) {
        return []
    }
    return innerText.data.replies.map((v: any) => v.content.message)
}

export const getTopCommentInfo = async (
    browser: Browser,
    bvid: string,
    mode: Mode
) => {
    let url =
        `http://api.bilibili.com/x/v2/reply/main?type=1&mode=${mode}&oid=` +
        bvToAv(bvid)
    let page = await browser.newPage()
    await page.goto(url)
    let innerText = await page.evaluate(() =>
        JSON.parse(document.querySelector('body')!.innerText)
    )
    await page.close()
    return innerText.data.top_replies === null ? [] : innerText.data.top_replies
}

export async function getProlemList(browser: Browser) {
    let p = await browser.newPage()
    await p.goto('https://member.bilibili.com/x/web/archives?status=not_pubed')
    let innerText = await p.evaluate(
        () => document.querySelector('pre').innerHTML
    )
    if (JSON.parse(innerText).data.arc_audits === null) return []
    await p.close()
    return JSON.parse(innerText)
        .data.arc_audits?.filter(
            (v: any) => v.Archive.state == -2 || v.Archive.state == -16
        )
        .map((ee: any) => ee.Archive.bvid)
}

export async function getPubedList(browser: Browser) {
    let p = await browser.newPage()
    let value = []
    for (let pageNumber = 1; pageNumber < 5; pageNumber++) {
        await p.goto(
            'https://member.bilibili.com/x/web/archives?status=pubed&pn=' +
                pageNumber
        )
        await p.waitForNetworkIdle()
        let innerText = await p.evaluate(
            () => document.querySelector('pre')?.innerHTML
        )
        if (
            JSON.parse(innerText)!.data['arc_audits'] === null ||
            innerText === undefined
        )
            break
        value.push(
            ...JSON.parse(innerText)
                .data.arc_audits.filter((v: any) => v.Archive.state == 0)
                .map((ee: any) => ee.Archive.bvid)
        )
    }
    console.log(value)

    return value
}

export async function getAlmostDoneList(browser: Browser): Promise<string[]> {
    let value: string[] = []
    for (let i = 0; i < 10; i++) {
        let p = await browser.newPage()
        await p.goto(
            'https://member.bilibili.com/x/web/archives?status=is_pubing&pn=' +
                i
        )
        let innerText = await p.evaluate(
            () => document.querySelector('pre')?.innerHTML
        )
        if (
            JSON.parse(innerText)!.data['arc_audits'] === null ||
            innerText === undefined
        )
            break
        value.push(
            ...JSON.parse(innerText)
                .data.arc_audits.filter((v: any) => v.Archive.state == -20)
                .map((ee: any) => ee.Archive.bvid)
        )
        p.close()
    }
    return value
}
