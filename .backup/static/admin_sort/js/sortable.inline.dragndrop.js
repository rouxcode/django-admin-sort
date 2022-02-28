const SortableListDrag = (function () {
    'use strict';

    var widgets;

    var cls = {
        draggable: 'admin-sort-row',
        handle: 'admin-sort-drag',
        inlines: 'admin-sort-draganddrop-inline'
    };

    domready(init);

    function init() {
        widgets = document.querySelectorAll('.' + cls.inlines);
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
            draggable: '.' + cls.draggable,
            handle: '.' + cls.handle,
            onUpdate: set_positions,
            ghostClass: 'admin-sort-ghost',
            chosenClass: 'admin-sort-chosen',
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