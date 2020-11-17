import Sortable from "sortablejs";

const SortableList = (function () {
    'use strict';

    let widgets;

    ready(init);

    function init() {
        widgets = document.querySelectorAll('.sortable-list');
        for (let i = 0; i < widgets.length; ++i) {
            init_widget(widgets[i]);
        }
    };

    function iniut_widget(w) {

    };

    function ready(callback) {
    };
})();