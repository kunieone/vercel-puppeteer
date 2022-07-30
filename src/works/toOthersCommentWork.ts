import axios from 'axios'
import colors from 'ansi-colors'

import { rand } from '../utils'
import config from '../config'
import { Browser } from 'puppeteer'
import { getMyInfo } from '../api'
import { State, toOthersComment } from '../comment'
import _ from 'lodash'
import { SingleBar } from 'cli-progress'

export const toOthersCommentWork = async (browser: Browser) => {
    const Rank = {
        综合排序: 'totalrank',
        最多点击: 'click',
        最新发布: 'pubdate',
        最多弹幕: 'dm',
        最多收藏: 'stow',
        最多评论: 'scores',
    }
    let myMid = await getMyInfo(browser).then((v) => v.data.mid)
    let keyword = rand(config.key_words, 1)[0]
    console.log({ keyword, myMid })

    let others = await axios
        .get(
            encodeURI(
                'http://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=' +
                    keyword +
                    '&order=' +
                    _.sample(Rank)
            )
        )
        .then((v) =>
            v.data.data.result
                .filter((data: any) => data.mid !== myMid)
                .map((v: any) => {
                    // console.log(v.author)
                    return v.bvid
                })
        )
    let stateBar = { repeat: 0, success: 0, fall: 0 }
    let b1 = new SingleBar({
        format:
            '广告发送' +
            '[' +
            colors.cyan('{bar}') +
            ']{percentage}% |{value}/{total}|{st}',
        // barCompleteChar: "=",
        // barIncompleteChar: " ",
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: false,
        barsize: 30,
    })
    b1.start(others.length, 0, { st: JSON.stringify(stateBar) })
    for (let i = 0; i < others.length; i++) {
        const e = others[i]
        let state: State = await toOthersComment(
            browser,
            e,
            _.sample(config.comments)
        )
        // console.log(state)

        switch (state) {
            case State.重复:
                stateBar.repeat++
                break
            case State.成功:
                stateBar.success++
                break

            default:
                stateBar.fall++
                break
        }
        b1.increment()
        b1.update({ st: JSON.stringify(stateBar) })
    }
    b1.stop()

    console.log('\n')

    return true
}
