import Sortable from 'sortablejs'


export default class SortInlineDrag {

    observer
    options
    rows
    widget

    init = false
    selectors = {}

    constructor(widget) {

        // check widget
        if (!widget) {
            throw 'SortInlineDrag no valid html element provided'
        }

        // add the widget element to the instance
        this.widget = widget

        // set selectors depending on inline type
        if (this.widget.dataset.adminSortType == 'stacked') {
            this.selectors = {
                row: '.inline-related',
                wrap: 'div > fieldset',
            }
        } else {
            this.selectors = {
                row: '.form-row',
                wrap: 'div > fieldset tbody',
            }
        }

        // position field selector
        this.selectors.position = '.' + this.widget.dataset.adminSortPositionField

        // get the list
        this.wrap = this.widget.querySelector(':scope ' + this.selectors.wrap)

        // init SortableJS
        this.sort = new Sortable(this.wrap, {

        })

        // watch list for changes
        this.observer = new MutationObserver(mutations => { this.mutated(mutations) })
        this.observer.observe(this.wrap, { childList: true })
    }

    init_rows() {
        this.rows = this.wrap.querySelectorAll(':scope ' + this.selectors.row)
        this.rows.forEach((row, i) => {
            row._pos = row.querySelector(':scope ' + this.selectors.position)
            if (row.classList.contains('has_original')) {
                row._pos.value = i + 1
            }
        })
    }

    mutated(mutations) {
        const cls = this.selectors.row.substr(1)
        mutations.forEach(mutation => {

            // bail out if the mutation is something else than a child node
            if (mutation.type != 'childList') {
                return
            }
            mutation.addedNodes.forEach(node => { this.init_rows() })
        })
    }
}