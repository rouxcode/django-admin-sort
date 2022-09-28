const SortableListDrag = (function () {
    'use strict';

    var widgets;

    var classes = {
        ghost: 'admin-sort-ghost',
        chosen: 'admin-sort-chosen'
    };
    var selectors = {
        draggable: '.admin-sort-row',
        handle: '.admin-sort-drag',
        stacked_wrap: 'fieldset.module',
        stacked_row: '.inline-related',
        tabular_wrap: 'fieldset.module tbody',
        tabular_row: '.form-row',
        widgets: '.admin-sort-draganddrop-inline'
    };

    domready(init);

    function init() {
        widgets = document.querySelectorAll(selectors.widgets);
        if (widgets.length) {
            for (let i = 0; i < widgets.length; ++i) {
                init_widget(widgets[i]);
            }
        }
    };

    function init_widget(widget) {
        widget._field = widget.dataset['admin-sort-position-field'];

    };

    function init_rows(widget) {

    };

    function init_sortable(widget) {
        widget._sortable = new Sortable(inl.$set[0], {
            draggable: selectors.draggable,
            handle: selectors.handle,
            onUpdate: set_positions,
            chosenClass: classes.chosen,
            ghostClass: classes.ghost,
        });
    };

    function set_positions(e) {

    };


    // Utilities -------------------------------------------------------------

    function domready(callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

})();