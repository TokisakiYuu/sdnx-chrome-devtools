// 租户列表页面
if (/\/auth\/services\/servicesList\/\d+\/account/.test(location.pathname)) {

    const rows = []
    let timer = null

    // 抓取表格数据
    document.addEventListener('DOMNodeInserted', event => {
        const target = event.target
        if (!(target instanceof HTMLElement)) return
        if (target.classList.contains('ant-table-row')) {
            rows.push(target)
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                collectComplete([...rows])
                rows.length = 0
            }, 200)
        }
    })

    document.addEventListener('DOMCharacterDataModified', event => {})

    function collectComplete(rows) {
        // 每行创建按钮
        rows.forEach(createButtonForRow)
        // fetch api monkey patch抓取获取loginKey的请求
        fetchTrap()
    }

    let requestAutoLogin = false
    
    /**
     * 创建按钮
     * @param {HTMLTableRowElement} row 
     */
    function createButtonForRow(row) {
        const phone = row.querySelector('td:nth-child(3)').innerText
        const operations = row.querySelector('td:nth-child(5)')
        const separator = dom('<div class="ant-divider ant-divider-vertical" role="separator"></div>')
        const button = dom(`<a>登录此账号</a>`)
        operations.appendChild(separator)
        operations.appendChild(button)
        button.addEventListener('click', () => {
            requestAutoLogin = true
            sessionStorage.setItem('sdnx_chrome_devtools_query_phone', phone)
            operations.querySelector('a:nth-of-type(4)').click()
        })
    }
    
    function fetchTrap() {
        const oldFetch = window.fetch
        const newFetch = async function(...args) {
            const [url] = args
            if (!requestAutoLogin || !url.endsWith('/authority/user/getLoginParam')) {
                return oldFetch(...args)
            }
            const res = await oldFetch(...args)
            const myRes = res.clone()
            requestAutoLogin = false
            const json = await myRes.json()
            if (json.code === 10000) {
                // TODO 获取token，获取系统号，写入localStorage，最后跳转页面
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
}

// 客户管理端登录页面
if (/\/user\/customLogin\/[\da-z]+/.test(location.pathname)) {
    console.log('custom login page')
}