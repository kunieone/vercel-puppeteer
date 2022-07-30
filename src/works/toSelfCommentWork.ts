import { Browser } from 'puppeteer'
import { getMyInfo, getPubedList } from '../api'
import { cocurrent } from '../utils'
import { toMyselfComment } from '../comment'

export async function toSelfCommentWork(browser: Browser) {
    let list: string[] = await getPubedList(browser)
    let myMid = await getMyInfo(browser).then((v) => v.data.mid)
    await cocurrent(
        '查看/发送个人评论',
        list,
        async (e) =>
            await toMyselfComment(
                myMid,
                browser,
                e,
                (Math.random() * 10).toFixed(1) +
                    '大家不要只跟队形,要三连+关注+斯信拿盒集![大笑]+'
            )
    )
}
