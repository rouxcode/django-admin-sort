// import scss (webpack madness)
import './scss/sort.scss'

// import the different modules
import SortList from './sort/list.js'

(function () {

    const selectors = {
        list: 'body.change-list .results',
        inline_drag: '',
        inline_select: '',
    }

    ready(init);

    function init() {
        const change_lists = document.querySelectorAll(selectors.list)
        if (change_lists.length > 0) {
            for_each(change_lists, (i, element) => {
                new SortList(element, admin_sort_options)
            })
        }
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