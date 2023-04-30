import { createOrderHtml, html, updateDraggingHtml, moveToColumn } from './view.js'
import { createOrderData, state } from './data.js';

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event
 */
const handleDragOver = (event) => {

    if (!column) return
    updateDraggingHtml({ over: column })

    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

}


const handleDragStart = (event) => {
    console.log('dragstart')

    let target = event.target;
    let orderID = target.dataset.id
    console.log(orderID)

}
const handleDragEnd = (event) => {

}


const handleHelpToggle = (event) => {
    const { target } = event

    let helpOverlay = html.help.overlay
    helpOverlay.style.display = 'block'

    if (target === html.help.cancel) {
        helpOverlay.style.display = 'none';
    }

}
const handleAddToggle = (event) => {
    const { target } = event

    let addOverlay = html.add.overlay

    if (target === html.other.add) {
        addOverlay.style.display = 'block'
        console.log("clicked add")
    } else if (target === html.add.cancel) {
        addOverlay.style.display = 'none'
        console.log("clicked cancel")
    }

}

const handleAddSubmit = (event) => {
    event.preventDefault()
    const { target } = event
    let addOverlay = html.add.overlay
    addOverlay.style.display = 'none'

    const data = {
        title: html.add.title.value,
        table: html.add.table.value,
        column: html.columns.ordered

    }

    const OrderObject = createOrderData(data)
    const fullOrder = createOrderHtml(OrderObject)
    const orderedColumn = document.querySelector('[data-column="ordered"]')

    state.orders[OrderObject.id] = OrderObject
    console.log(state)
    console.log(fullOrder)


    if (target === html.add.form)
        orderedColumn.append(fullOrder)

    html.add.form.reset()


}


const handleEditToggle = (event) => {
    const { target } = event
    const editOverlay = html.edit.overlay
    editOverlay.style.display = 'block'

    if (target === html.edit.cancel) {
        editOverlay.style.display = 'none'
    }
    let orderID = target.dataset.id
// console.log(orderID)


    html.edit.title.value = state.orders[orderID].title
    html.edit.table.value = state.orders[orderID].table

}


const handleEditSubmit = (event) => { // submit the edited form
    event.preventDefault()
    const {target} = event

    let order = document.querySelector(".order")
    let orderDivId =order.dataset.id // get the data-id

    const newCol = document.querySelector("[data-edit-column]").value


    const updatedData = {
        id: orderDivId,
        title: html.edit.title.value,
        table: html.edit.table.value,
        created: state.orders[orderDivId].created
    }


    let newColumn= html.columns[newCol]
    state.orders[orderDivId].title = updatedData.title
    state.orders[orderDivId].table = updatedData.table
    state.orders[orderDivId].column = newColumn
    console.log(state.orders[orderDivId].column)

    const newHtmlOrder = createOrderHtml(updatedData)

    let deleteDiv = document.querySelector(`[data-id="${orderDivId}"]`)


    if (target === html.edit.form){
        deleteDiv.remove()
        newColumn.append(newHtmlOrder)
    }


    html.edit.overlay.style.display = 'none'


}


const handleDelete = (event) => { //delete order
    const { target } = event

    let order = document.querySelector(".order")
    let orderDivId = order.dataset.id
    let removediv = document.querySelector(`[data-id="${order.dataset.id}"]`)

    removediv.remove()
    console.log(state)

    html.edit.overlay.style.display = "none"


}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}