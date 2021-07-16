import Sortable from 'sortablejs'


export default class SortInlineDrag {

    has_extra
    observer
    options
    rows
    selectors
    widget

    constructor(widget) {

        // check widget
        if (!widget) {
            throw 'SortInlineDrag no valid html element provided'
        }

        // add the widget element to the instance
        this.widget = widget

        // get basic conf
        this.type = widget.dataset.adminSortType || 'stacked'
        this.has_extra = widget.classList.contains('admin-sort-has-extra')

        // set selectors depending on inline type
        if (this.type == 'stacked') {
            this.selectors = {
                row: '.inline-related',
                wrap: 'div > fieldset',
            }
        } else {
            this.selectors = {
                row: '.form-row',
                wrap: 'div > fieldset > table > tbody',
            }
        }

        // position field selector
        this.selectors.position = '.admin-sort-position'

        // if we use the django extra rows add has_original to the row selector
        if (this.has_extra) {
            this.selectors.row += '.has_original'
        }

        // get the list
        this.wrap = this.widget.querySelector(':scope ' + this.selectors.wrap)

        // init SortableJS
        this.sort = new Sortable(this.wrap, {
            draggable: this.selectors.row,
            handle: '.admin-sort-drag',
            ghostClass: 'admin-sort-ghost',
            chosenClass: 'admin-sort-chosen',
            onUpdate: e => { this.set_rows() },
        })

        // init rows 
        this.set_rows()

        // watch list for changes if django extra rows isn'tr used
        if (!this.has_extra) {
            this.observer = new MutationObserver(m => { this.mutated(m) })
            this.observer.observe(this.wrap, { childList: true })
        }
    }

    mutated(mutations) {
        const css_class = this.selectors.row.substr(1)
        mutations.forEach(mutation => {
            const nodes = mutation.addedNodes
            if (nodes.length > 0 && nodes[0].classList.contains(css_class)) {
                this.set_rows()
            }
        })
    }

    set_rows() {
        this.rows = this.wrap.querySelectorAll(':scope ' + this.selectors.row)
        this.rows.forEach((row, i) => {

            // set position
            row._pos = row.querySelector(':scope ' + this.selectors.position)
            if (!this.has_extra || row.classList.contains('has_original')) {
                row._pos.value = i + 1
            }

            // set drag n drop handle
            if (!row.querySelector(':scope .admin-sort-drag')) {

                // select the correct target for the handle
                row._target = this.type == 'stacked' ? row : row.querySelector(':scope .original')
                // append the handle to the chosen target
                row._target.insertAdjacentHTML('beforeend', '<div class="admin-sort-drag"></div>')
            }
        })
    }
}