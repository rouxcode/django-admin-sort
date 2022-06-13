

export default class SortInlineDropDown {

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
        var sortable_rows_count = this.rows.length
        this.rows.forEach((row, i) => {

            // position dropdown
            row._pos = row.querySelector(':scope ' + this.selectors.position)
            row._pos.innerHTML = '';

            if (i + 1 > sortable_rows_count) {
                row._pos.append(new Option('-', ''));
            } else {
                // set options
                for (var j=0; j<sortable_rows_count; j++) {
                    row._pos.append(new Option(j + 1, j + 1));
                }
                // set current value
                row._pos.value = i + 1;
                // add listener if not yet added
                if (!row._has_listener) {
                    row._pos.addEventListener('change', this.on_dropdown_change)
                    row._has_listener = true;
                }
            }
        })
    }

    on_dropdown_change(event) {
        // set values

        // reorder!
        var wrap = event.currentTarget.closest(this.selectors.wrap);
        [...list.children]
            .sort((a,b)=>a._pos.value>b._pos.value? 1 : -1)
            .forEach(node=>wrap.appendChild(node));

    }
}