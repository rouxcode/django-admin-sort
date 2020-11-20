const SortableListDrag = (function () {
    'use strict';

    /*
    TODO implement Inline extra even if imho this is crap
    */

    var widgets;

    var selectors = {
        inlines: '.admin-sort-draganddrop-inline'
    };

    domready(init);

    function init() {
        widgets = document.querySelectorAll(selectors.inlines);
        if (widgets.length) {
            for (let i = 0; i < widgets.length; ++i) {
                init_widget(widgets[i]);
            }
        }
    };

    function init_widget(widget) {

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