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

function createButtonForRow(row) {
    
}