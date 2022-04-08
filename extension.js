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
    button.addEventListener('click', () => {
        // TODO 发起登录请求，得到token，写入localStorage，跳转页面
        console.log(data)
    })
    document.addEventListener('popstate', () => {
        separator.remove()
        button.remove()
    })
}

function fetchTrap(callback) {
    const oldFetch = window.fetch
    const newFetch = async function(...args) {
        const [url] = args
        const res = await oldFetch(...args)
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