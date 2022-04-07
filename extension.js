// const targets = document.querySelectorAll('.ant-table .ant-table-tbody .ant-table-cell:last-child')

const rows = []
let timer = null

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

document.addEventListener('DOMCharacterDataModified', event => {
    console.log('文本发生变化', event);
})

function collectComplete(rows) {
    rows.forEach(createButtonForRow)
}

/**
 * 创建按钮
 * @param {HTMLTableRowElement} row 
 */
function createButtonForRow(row) {
    const phone = row.querySelector('td:nth-child(3)').innerText
    console.log(`create button => phone: ${phone}`);
    const operations = row.querySelector('td:nth-child(5)')
    const separator = dom('<div class="ant-divider ant-divider-vertical" role="separator"></div>')
    const button = dom(`<a>登录此账号</a>`)
    operations.appendChild(separator)
    operations.appendChild(button)
    button.addEventListener('click', () => {
        window.open('https://www.baidu.com/s?wd=hello')
    })
}

function dom(str) {
    const div = document.createElement('div')
    div.innerHTML = str
    return div.firstElementChild
}