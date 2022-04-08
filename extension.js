const tokenRawData = localStorage.getItem('sdnxRequestId_1001')
const tokenData = JSON.parse(tokenRawData)
const requestToken = tokenData.value

/**
 * 创建按钮
 * @param {HTMLTableRowElement} row 
 */
function createButtonForRow(row, data) {
    const operations = row.querySelector('td:nth-child(5)')
    const separator = dom('<div class="ant-divider ant-divider-vertical" role="separator"></div>')
    const button = dom(`<a>登录此账号</a>`)
    operations.appendChild(separator)
    operations.appendChild(button)
    button.addEventListener('click', async () => loginSystem(data))
    document.addEventListener('popstate', () => {
        separator.remove()
        button.remove()
    })
}

async function getLoginKey(data) {
    const res = await originFetch('/gateway/authority/user/getLoginParam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'sdnxRequestId': requestToken
        },
        body: JSON.stringify(data)
    })
    const json = await res.json()
    if (json.code === 10000) {
        return json.info.loginKey
    }
}

async function loginSystem(data) {
    const { systemCode, userNo, userPhone } = data
    const loginKey = await getLoginKey({
        systemCode,
        userNo
    })
    const loginRes = await originFetch('/gateway/authority/login/normal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            loginKey: loginKey,
            password: "e10adc3949ba59abbe56e057f20f883e",
            userName: userPhone
        })
    })
    const loginJson = await loginRes.json()
    if (loginJson.code === 10000) {
        const { userIndexInfoList, token, systemCode } = loginJson.info
        const [indexPageInfo] = userIndexInfoList
        const { indexUrl, prefix } = indexPageInfo
        localStorage.setItem(`sdnxRequestId_${systemCode}`, `{"value":"${token}","writeTime":${Date.now()}}`)
        window.open(`/${prefix}${indexUrl}`)
    }
}

/** @type {(input: RequestInfo, init?: RequestInit) => Promise<Response>} */
let originFetch = null

function fetchTrap(callback) {
    originFetch = window.fetch
    const newFetch = async function(...args) {
        const [url] = args
        const res = await originFetch(...args)
        const myRes = res.clone()
        const json = await myRes.json()
        if (json.code === 10000) {
            callback(url, json.info)
        }
        return res
    }
    Reflect.set(window, 'fetch', newFetch)
}

function dom(str) {
    const div = document.createElement('div')
    div.innerHTML = str
    return div.firstElementChild
}

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))

// 是否是租户列表页面
function isTenantAccountPage() {
    return /\/auth\/services\/servicesList\/\d+\/account/.test(location.pathname)
}

function isTenantListAPI(url) {
    return /\/authority\/user\/pageTenantInfo$/.test(url)
}

fetchTrap(async (url, data) => {
    await sleep(50)
    if (!isTenantAccountPage()) return
    if (isTenantListAPI(url)) {
        await sleep(500)
        const rows = Array.from(document.querySelectorAll('.ant-table-row'))
        rows.forEach((row, index) => {
            createButtonForRow(row, data.records[index])
        })
    }
})