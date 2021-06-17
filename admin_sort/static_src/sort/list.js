import Sortable, { Swap } from 'sortablejs'


export default class SortList {

    constructor(widget, options) {

        // set the css_classes
        this.css_classes = {
            chosenClass: 'admin-sort-chosen',
            draggable: 'draggable-item',
            ghostClass: 'admin-sort-ghost',
            handle: 'admin-sort-drag',
        }

        // set the css selectors
        this.selectors = {
            clean: '#admin-sort-reorder-link',
            draggable: '.' + this.css_classes.draggable,
            handle: '.' + this.css_classes.handle,
            list: ':scope tbody',
            row: ':scope tbody tr'
        }

        // check widget
        if (!widget) {
            throw 'SortList no valid html element provided';
        }
        // check options
        if (!options) {
            throw 'SortList no valid options provided';
        }

        // add the widget element to the instance
        this.widget = widget

        // add the instance to the element
        this.widget._sort = this

        // save options
        this.set_options(options)

        // init_messages
        this.init_message()

        // query the needed elements
        this.list = this.widget.querySelector(this.selectors.list)
        this.rows = this.widget.querySelectorAll(this.selectors.row)

        // exit if we got no rows to sort
        if (this.rows.length < 1) { return }

        // initialize the rows
        this.rows.forEach((row, i) => {
            // set needed attrs
            row._key = i
            row._drag = row.querySelector(this.selectors.handle)
            row._pk = row._drag.dataset.pk
            // add the draggable class
            row.classList.add(this.css_classes.draggable);
        })

        // link widget to list directly
        this.list._widget = widget;

        // add css class for styling purposes
        this.widget.classList.add('sortable-list');

        // set reorder link
        this.clean = document.querySelector(this.selectors.clean)
        this.clean.addEventListener('click', this.request_clean.bind(this));

        // init sortable list
        this.sortable = Sortable.create(this.list, {
            draggable: this.selectors.draggable,
            handle: this.selectors.handle,
            ghostClass: this.css_classes.ghostClass,
            chosenClass: this.css_classes.chosenClass,
            onUpdate: this.request_order.bind(this),
        });
    }

    // order 
    async request_order(e) {

        // exit if index stays the same
        if (e.oldIndex === e.newIndex) { return }

        // show message
        this.show_message(this.messages.sorting);

        const row = e.item;
        const key = e.newIndex;

        // prepare data 
        const data = new FormData();
        data.append('csrfmiddlewaretoken', this.csrf);
        data.append('obj', row._pk);

        // select the list in the actual state, so sorting is right
        const list = this.widget.querySelectorAll(this.selectors.draggable);

        // set the target pk and the position relative to it
        if (key === 0) {
            data.append('position', 'left');
            data.append('target', list[1]._pk);
        } else {
            data.append('position', 'right');
            data.append('target', list[key - 1]._pk);
        }

        fetch(this.urls.update, { method: 'POST', body: data })
            .then(re => {
                if (re.status === 200) {
                    return re.json()
                } else {
                    console.error('admin_sort: ' + re.statusText)
                }
            })
            .then(data => {
                this.hide_message();
            })
            .catch(error => {
                console.error('admin_sort: ' + error)
            })
    };

    // Clean sorting  ----------------------------------------------------------------

    async request_clean(e) {

        // prevent default action of <a> element
        if (e) { e.preventDefault() }

        // build form data
        const data = new FormData()
        data.append('csrfmiddlewaretoken', this.csrf);

        // show message
        this.show_message(this.messages.reordering);

        // make the ajax request
        fetch(this.urls.update, { method: 'POST', body: data })
            .then(re => {
                if (re.status === 200) {
                    return re.json()
                } else {
                    console.error('admin_sort: ' + re.statusText)
                }
            })
            .then(data => {
                this.hide_message()
                window.location.reload()
            })
            .catch(error => {
                console.error('admin_sort: ' + error)
            })
    }


    // messaging --------------------------------------------------------------

    init_message() {
        this.msg = document.createElement('div')
        this.msg.id = 'admin-sort-state'
        this.msg.classList.add('admin-sort-state')
    }

    show_message(message) {
        this.msg.innerHtml = '<span class="msg">' + message + '</span>'
            + '<span class="admin-sort-loader">'
            + '<span class="admin-sort-loader-inner"></span>'
            + '</span>'
        this.widget.appendChild(this.msg)
    }

    hide_message() {
        this.msg.remove()
    }


    // Utilities -------------------------------------------------------------

    set_options(options) {
        // TODO check if option has value & do proper init or error handling
        this.csrf = options.csrf
        this.messages = options.messages
        this.pages = options.pages
        this.urls = options.urls
    }
}