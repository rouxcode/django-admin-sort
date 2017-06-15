// TODO Minify
var SortableList = (function( $ ) {
    'use strict';

    var csrftoken;
    var current_page;
    var direction;
    var first_position;
    var sortable;
    var total_pages;
    var update_url;
    var wrap;

    var $actions;
    var $page_field;
    var $step_field;
    var $wrap;

    var draggable_class = 'draggable-element';

    $(document).ready( init );

    function init() {
        $wrap = $('#result_list tbody');
        $actions = $('#changelist-form .actions');

        // ugly hack to check if djangocms-admin-style is installed
        if ( $('.toolbar-item').length > 0 ) {
            $('#result_list').addClass('cms-admin-style');
            $('body').addClass('cms-admin-style');
        }

        // if there is a result list create sortable
        if( $wrap.length > 0 ) {

            wrap = $wrap[0];
            // set sortable env
            $('.row1, .row2').addClass(draggable_class);
            direction = get_direction();
            first_position = parseInt($('.' + draggable_class + ':first .admin-sort-drag').data('order'));
            sortable = new Sortable(wrap, {
                draggable: "." + draggable_class,
                forceFallback: true,
                fallbackTolerance: 5,
                handle: '.admin-sort-drag',
                ghostClass: "sortable-ghost",
                chosenClass: "sortable-chosen",
                onUpdate: update
            });
        }
        // if there are admin actions create the page_move
        if ( $actions.length > 0 ) {
            page_move();
        };
    };

    // Drag Drop --------------------------------------------------------------

    function update(e) {
        if ( e.oldIndex != e.newIndex ) {
            var $item = $( e.item );
            var original_position = parseInt( $item.find('.admin-sort-drag').data('order') );
            var new_position = original_position + ( (e.newIndex - e.oldIndex) * direction );
            $.ajax({
                url: update_url,
                type: 'POST',
                data: {
                    o: direction,
                    startorder: original_position,
                    endorder: new_position,
                    csrfmiddlewaretoken: csrftoken
                },
                success: updated_successful,
                error: updated_error
            });
        }
    };

    function updated_successful(data) {
        var $rows = $('.' + draggable_class);
        var $items = $('.' + draggable_class + ' .admin-sort-drag');
        var index = first_position;
        for ( var i = 0; i < $rows.length; i++ ) {
            var $item = $( $items[ i ] );
            var $row = $( $rows[ i ] );
            $item.data({ order: index });
            $row.removeClass('row1 row2')
                .addClass(i % 2 ? 'row2' : 'row1');
            if( $item.data('field') ) {
                $('.' + $item.data('field'), $row ).html(index);
            }
            index += direction;
        }
    };

    function updated_error(response) {
        console.error('The server responded: ' + response.responseText);
    };

    function get_direction() {
        var $items = $('.' + draggable_class + ' .admin-sort-drag');
        if ( $items.length > 1 ) {
            if ( parseInt( $items[0].getAttribute('data-order') ) > parseInt( $items[1].getAttribute('data-order') ) ) {
                return -1;
            } else {
                return 1;
            }
        }
        // TODO check if there is a fallback possibility
        return 0;
    };

    // Page Move --------------------------------------------------------------

    function page_move() {
        // TODO do it the proper way
        $step_field = $('#changelist-form-step');
        $page_field = $('#changelist-form-page');
        if (current_page == total_pages) {
            $page_field.attr('max', total_pages - 1);
            $page_field.val(current_page - 1);
        } else {
            $page_field.attr('max', total_pages);
            $page_field.val(current_page + 1)
        }
        if(current_page == 1) {
            $page_field.attr('min', 2);
        } else {
            $page_field.attr('min', 1);
        }
        $step_field.attr('min', 1);
        $('#changelist-form select[name="action"]').change(select_action);
    };

    function select_action( e ) {
        if (['move_to_back_page', 'move_to_forward_page'].indexOf($(this).val()) != -1) {
            if ($(this).val() == 'move_to_forward_page') {
                $step_field.attr('max', total_pages - current_page);
            } else {
                $step_field.attr('max', current_page - 1);
            }
            $step_field.addClass('active');
        } else {
            $step_field.removeClass('active');
        }
        if ($(this).val() == 'move_to_exact_page') {
            $page_field.addClass('active');
        } else {
            $page_field.removeClass('active');
        }
    };

    // Utilities --------------------------------------------------------------

    function set_options( options ) {
        // TODO check if option has value & do proper init or error handling
        csrftoken = options.csrftoken;
        current_page = options.current_page;
        total_pages = options.total_pages;
        update_url = options.update_url;
    };

    return {
        options: set_options
    }

})( django.jQuery );
