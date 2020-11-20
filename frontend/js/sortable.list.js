const SortableList = (function () {
    'use strict';

    let csrf;
    let messages;
    let pages;
    let urls;
    let widget;
    let msg;

    const selectors = {
        'draggable': '.draggable-item',
        'handle': '.admin-sort-drag',
        'reorder': '#admin-sort-reorder-link'
    };

    domready(init);

    return { options: set_options };


    // Init all ---------------------------------------------------------------

    function init() {
        widget = document.querySelector('.results');

        // exit if widget is undefined
        if (!widget) { console.log('nolist'); return; }

        widget._list = widget.querySelector('tbody');
        widget._rows = widget._list.querySelectorAll('.row1, .row2');

        // exit if we got no rows to sort
        if (widget._rows.length < 1) { return; }

        // init_messages
        init_message();

        // initialize the rows
        init_rows();


        // link widget to list directly
        widget._list._widget = widget;

        // add css class for styling purposes
        widget.classList.add('sortable-list');

        // init sortable list
        widget._sortable = new Sortable(widget._list, {
            draggable: selectors.draggable,
            handle: selectors.handle,
            ghostClass: "admin-sort-ghost",
            chosenClass: "admin-sort-chosen",
            onUpdate: update
        });

        // set reorder link
        widget._reorder = document.querySelector(selectors.reorder);
        widget._reorder.addEventListener('click', reorder);
    };

    function init_rows() {
        let i, row;
        for (i = 0; i < widget._rows.length; ++i) {
            row = widget._rows[i];
            row._drag = row.querySelector(selectors.handle);

            row._key = i;
            row._pk = row._drag.dataset.pk;

            row.classList.add(selectors.draggable.substr(1));
        }
    };


    // Reorder ----------------------------------------------------------------

    async function reorder(e) {

        // prevent default action of <a> element
        if (e) { e.preventDefault(); }

        // build form data
        const data = new FormData();
        data.append('csrfmiddlewaretoken', csrf);

        // show message
        show_message(messages.reordering);

        // make the ajax request
        let json;
        let re = await fetch(urls.update, { method: 'POST', body: data });
        if (re.ok) {
            json = await re.json();
        } else {
            console.warn("HTTP-Error: " + r.status);
        }
        hide_message();
        window.location.reload();
    };

    async function update(e) {
        // exit if index stays the same
        if (e.oldIndex === e.newIndex) {
            return;
        }

        // show message
        show_message(messages.sorting);

        const row = e.item;
        const key = e.newIndex;
        const list = widget.querySelectorAll(selectors.draggable);

        // prepare data 
        const data = new FormData();
        data.append('csrfmiddlewaretoken', csrf);
        data.append('obj', row._pk);

        // set the target pk and the position relative to it
        if (key === 0) {
            data.append('position', 'left');
            data.append('target', list[1]._pk);
        } else {
            data.append('position', 'right');
            data.append('target', list[key - 1]._pk);
        }

        let json;
        let re = await fetch(urls.update, { method: 'POST', body: data });
        if (re.ok) {
            json = await re.json();
        } else {
            console.warn("HTTP-Error: " + r.status);
        }
        update_rows();
        hide_message();
    };

    function update_rows() {
        const classes = ['row1', 'row2'];

        // reload list to be sure to get it in the right order
        widget._rows = widget.querySelectorAll(selectors.draggable);

        for (let i = 0; i < widget._rows.length; ++i) {

            // reset css classes
            widget._rows[i].classList.remove('row1', 'row2');
            widget._rows[i].classList.add(classes[i % 2]);
        }
    };


    // messaging --------------------------------------------------------------

    function init_message() {
        msg = document.createElement('div');
        msg.id = 'admin-sort-state';
        msg.classList.add('admin-sort-state');
    };

    function show_message(message) {
        msg.innerHtml = '<span class="msg">' + message + '</span>'
            + '<span class="admin-sort-loader">'
            + '<span class="admin-sort-loader-inner"></span>'
            + '</span>';
        widget.appendChild(msg);
    };

    function hide_message() {
        msg.remove();
    };


    // Utilities -------------------------------------------------------------

    function set_options(options) {
        // TODO check if option has value & do proper init or error handling
        csrf = options.csrf;
        messages = options.messages;
        pages = options.pages;
        urls = options.urls;
    };

    function domready(callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };
})();
