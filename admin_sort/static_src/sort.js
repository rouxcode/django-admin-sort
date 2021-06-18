// import scss (webpack madness)
import './scss/sort.scss'

// import the different modules
import SortList from './sort/list.js'
import SortInlineDrag from './sort/inline.drag.js'


(function () {

    const selectors = {
        list: 'body.change-list .results',
        inline_drag: '.admin-sort-inline',
    }

    ready(init);

    function init() {
        // django admin change lists drag and drop ----------------------------
        const lists = document.querySelectorAll(selectors.list)
        if (lists.length > 0) {
            lists.forEach((element) => {
                new SortList(element, admin_sort_change_list_options)
            })
        }

        // django admin inlines drag and drop ---------------------------------
        const inlines_drag = document.querySelectorAll(selectors.inline_drag)
        if (inlines_drag.length > 0) {
            console.log('pfuiiiii')
            inlines_drag.forEach((element) => {
                new SortInlineDrag(element)
            })
        }

        // django admin change lists select dropdown --------------------------
        // TODO Implement

        // django admin inlines select dropdown -------------------------------
        // TODO Implement
    }

    function ready(callback) {
        if (document.readyState != 'loading') {
            callback()
        } else {
            document.addEventListener('DOMContentLoaded', callback)
        }
    }

    function for_each(array, func) {
        for (let i = 0; i < array.length; ++i) {
            func(i, array[i])
        }
    }
})()