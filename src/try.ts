import axios from 'axios'

setInterval(() => {
    console.log(`send`)

    axios
        .get(
            'http://api.bilibili.com/x/v2/reply/main?type=1&mode=2&oid=248440672'
        )
        .then((v) => v.data.data.replies.map((v) => v.content.message))
        .then(console.log)
}, 1030)
