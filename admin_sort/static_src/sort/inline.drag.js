import Sortable from 'sortablejs'


export default class SortInlineDrag {

    constructor(widget, options) {

        // check widget
        if (!widget) {
            throw 'SortInlineDrag no valid html element provided'
        }

        // add the widget element to the instance
        this.widget = widget

        // set/get the options/settings
        this.set_options(options)

        console.log(widget)
    }

    set_options(options) {
        // TODO check if we need this
    }
}