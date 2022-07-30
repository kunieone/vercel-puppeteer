import axios from 'axios'
import cliProgress from 'cli-progress'
// import qrcode from 'qrcode-terminal'

// note: you have to install this dependency manually since it's not required by cli-progress
import colors from 'ansi-colors'

import _ from 'lodash'

import { Browser, Page } from 'puppeteer'
export const rand = (list: any[], num: number) =>
    list.sort(() => Math.random() - 0.5).slice(0, num)
// console.log(rand([1,2,3],2));

let a2bEncTable = [
    'f',
    'Z',
    'o',
    'd',
    'R',
    '9',
    'X',
    'Q',
    'D',
    'S',
    'U',
    'm',
    '2',
    '1',
    'y',
    'C',
    'k',
    'r',
    '6',
    'z',
    'B',
    'q',
    'i',
    'v',
    'e',
    'Y',
    'a',
    'h',
    '8',
    'b',
    't',
    '4',
    'x',
    's',
    'W',
    'p',
    'H',
    'n',
    'J',
    'E',
    '7',
    'j',
    'L',
    '5',
    'V',
    'G',
    '3',
    'g',
    'u',
    'M',
    'T',
    'K',
    'N',
    'P',
    'A',
    'w',
    'c',
    'F',
]
let a2bEncIndex = [11, 10, 3, 8, 4, 6]
let a2bXorEnc = 0b1010100100111011001100100100
let a2bAddEnc = 8728348608

export const trimTitle = (rawTitle: string) => {
    return rawTitle.replace(
        /(@[u4e00-u9fa5_a-zA-Z0-9]+\s+)|\-|\.mp4|\.flv|\.srt|^\d+|音声|中文音声|步非烟|\s+\d+\s+|\[.+\]|\【.+\】|.+\s\d+\s\-|(#[u4e00-u9fa5_a-zA-Z0-9]+\s+)/g,
        ''
    )
}

export const countDown = async (ms: number) => {
    let c = setInterval(() => {
        if (ms <= 0) {
            clearInterval(c)
        }
        ms -= 500
        console.log(ms, '!')
    })
}

/**
 * 相似度对比
 * @param s 文本1
 * @param t 文本2
 * @param f 小数位精确度，默认2位
 * @returns {string|number|*} 百分数前的数值，最大100. 比如 ：90.32
 */

/* 稍微求一下字符串相似，因为提高容错率 */
export const similar = (s: string, t: string, f: number = 2) => {
    if (!s || !t) {
        return 0
    }
    if (s === t) {
        return 100
    }
    var l = s.length > t.length ? s.length : t.length
    var n = s.length
    var m = t.length
    var d: any = []
    f = f || 2
    var min = function (a: any, b: any, c: any) {
        return a < b ? (a < c ? a : c) : b < c ? b : c
    }
    var i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
        d[i] = []
        d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1)
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1)
            if (si === tj) {
                cost = 0
            } else {
                cost = 1
            }
            d[i][j] = min(
                d[i - 1][j] + 1,
                d[i][j - 1] + 1,
                d[i - 1][j - 1] + cost
            )
        }
    }
    let res = (1 - d[n][m] / l) * 100
    return parseFloat(res.toFixed(f))
}

/* 超时刷新 */
export async function timeoutRefresh(
    page: Page,
    selector: string,
    timeout: number = 15 * 1000
) {
    let timer = 0
    let t = setInterval(async () => {
        timer += 1000
        if (timer > timeout) {
            page.reload()
        }
    }, 1000)

    await page.waitForSelector(selector)
    clearInterval(t)
}

export function bvToAv(bv: any) {
    let tmp = 0
    for (let i = 0; i < a2bEncIndex.length; i++) {
        if (a2bEncTable.indexOf(bv[a2bEncIndex[i]]) == -1) {
            return '请输入正确的BV号！'
        } else {
            tmp +=
                a2bEncTable.indexOf(bv[a2bEncIndex[i]]) *
                Math.pow(a2bEncTable.length, i)
        }
    }
    tmp = (tmp - a2bAddEnc) ^ a2bXorEnc
    return tmp
}
export function avToBv(av: number) {
    if (Math.floor(av) == av) {
        let tmp: any = 'BV1@@4@1@7@@'
        for (let i = 0; i < a2bEncIndex.length; i++) {
            tmp =
                tmp.substring(0, a2bEncIndex[i]) +
                a2bEncTable[
                    Math.floor(
                        ((av ^ a2bXorEnc) + a2bAddEnc) /
                            Math.pow(a2bEncTable.length, i)
                    ) % a2bEncTable.length
                ] +
                tmp.substring(a2bEncIndex[i] + 1)
        }
        return tmp
    } else {
        return '请输入正确的AV号！（纯数字不带AV）'
    }
}

export const crawBVID = async (r_keywords: string, r_page: number) => {
    let bvs = []
    console.log(`搜索第${r_page}页`)
    const url = `https://search.bilibili.com/all?keyword=${r_keywords}&from_source=webtop_search&spm_id_from=333.1007&order=pubdate&page=${r_page}&o=120`
    console.log(url)
    let ctx = await axios.get(encodeURI(url)).then((res) => res.data)
    // console.log(ctx)
    let regex = /libili.com\/video\/BV([0-9a-zA-Z]+)/g
    for (const v of ctx.matchAll(regex)) {
        // console.log(v[1])
        bvs.push('BV' + v[1])
    }
    return bvs
}
// 把一个长数组分块分别同步+异步处理，对于打开标签页来说如果数量过大导致过慢，但是如果数量太少，一次只打开一个，又浪费时间。
// 所以如果要打开40个标签页，就会把40分为：根号40 ～向大方向整除 7 个数组，7个数组同时开启，内部按顺序同步打开。（一次七个）
// 第二个回调函数是每次都处理步骤，第三个回调函数是结束的处理。
export async function cocurrent(
    taskName: string = '任务',
    arr: any[],
    callback: (el: any) => any,
    done: () => any = () => {}
): Promise<any> {
    const b1 = new cliProgress.SingleBar({
        format:
            taskName +
            '[' +
            colors.cyan('{bar}') +
            ']{percentage}% || {value}/{total}',
        // barCompleteChar: "=",
        // barIncompleteChar: " ",
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: false,
        barsize: 30,
    })
    let length = arr.length
    let d2Arr = _.chunk(arr, Math.ceil(Math.sqrt(length)))
    let c = 0
    b1.start(length, 0)
    return new Promise(async (res, _) => {
        d2Arr.map(async (el) => {
            for (let i = 0; i < el.length; i++) {
                const eell = el[i]
                await callback(eell)
                c++
                b1.increment()
                // console.log(`${c}/${length}`);
                if (c === arr.length) {
                    b1.stop()
                    console.log('\n')
                    let resp = await done()
                    res(resp)
                }
            }
        })
    })
    // console.log(res)
}

export const loginBilibili = async (browser: Browser) => {
    let page = await browser.newPage()
    // type HaveTitle = { title: string }
    await page.goto('https://passport.bilibili.com/login', {
        waitUntil: 'load',
    })
    let title = await page.evaluate(() => {
        return document.querySelector('.qrcode-img')!.title
    })
    console.log(title)

    // qrcode
}

export async function repeatClick(
    page: Page,
    option: { x: number; y: number },
    time: number = 1000,
    range: number = 0
) {
    let ran = () => Math.floor(Math.random() * (2 * range)) - range
    let gc = 0
    let c = setInterval(async () => {
        let pos = [option.x + ran(), option.y + ran()]
        console.log(pos)
        await page.mouse.click(pos[0], pos[1])
        gc += 5000
        if (gc >= time) {
            console.log(`清除点击`)
            clearInterval(c)
        }
    }, 300)
    return c
}

export async function retry(time: number, cb: Function) {
    let tim = 0
    let c = setInterval(() => {
        tim++
    }, 1000)

    if (tim >= time) {
        console.log(`超时重试！`)
        clearInterval(c)
        retry(time, cb)
    }
    await cb()
    clearInterval(c)
    return
}
