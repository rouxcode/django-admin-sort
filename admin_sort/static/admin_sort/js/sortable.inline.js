var SortableInline = (function ( $ ) {
    'use strict';

    var $groups;

    $(document).ready( init );

    function init() {
        $groups = $('.sortable-inline');
        if ( $groups.length > 0) {
            for ( var i = 0; i < $groups.length; i++ ) {
                var $group = $( $groups[i] );
                $group.find(".add-row").click(add_row_handler);
                if( $group.hasClass('sortable-tabular') ) {
                    init_tabular( $group );
                } else {
                    init_stacked( $group );
                }
            }
        }
    };

    function init_stacked( $group ) {
        var $wrap = $('.inline-group', $group);
        if ($wrap.find('fieldset.module').size()) {
            // django > 1.9
            $wrap = $wrap.find('fieldset.module')
        }
        var $inlines = $('.inline-related', $wrap);
        var $sortable_inlines = $inlines;
        if ($group.hasClass('has-extra')) {
            $sortable_inlines = $inlines.filter('.has_original').addClass('is_sortable');
            $('.inline-related', $wrap).not('.has_original').first().addClass('first-empty');
        } else {
            $inlines.addClass('is_sortable');
        }
        $sortable_inlines.append('<div class="drag"></div>');
        if (1) { // } $inlines.length > 1 ) {
            init_sortable($wrap, $inlines, '.drag', false);
        }
        update({'from': $wrap[0]});
    };

    function init_tabular($group) {
        var $wrap = $('.module tbody', $group);
        var $inlines = $('tr', $wrap);
        var $sortable_inlines = $inlines;
        var $head = $('.module thead tr', $group);
        var $first_label = $head.find('th:first');
        var cols_spanned = parseInt($first_label.attr('colspan'));
        if (cols_spanned > 1) {
            // django <= 1.9
            $first_label.attr({colspan: cols_spanned - 1});
        } else {
            // django > 1.9
            $head.find('.original').remove();
        }
        $first_label.attr({colspan: parseInt($first_label.attr('colspan')) - 1});
        $head.prepend('<th class="drag-label">&nbsp;</th>');
        if ($group.hasClass('has-extra')) {
            $sortable_inlines = $inlines.filter('.has_original').addClass('is_sortable');
            $('tr', $wrap).not('.has_original').first().addClass('first-empty');
        } else {
            $inlines.addClass('is_sortable');
        }
        if (1) { // }$inlines.length > 1 ) {
            init_sortable( $wrap, $inlines, '.original', true );
        }
        update({'from': $wrap[0]});
    };

    function init_sortable($wrap, $inlines, handle, is_tabular) {
        // TODO: replace! must come via data-attr/config/inline/order field
        // var values = [
        //     parseInt($( $inlines[0] ).find('.default-order-field').val()),
        //     parseInt($( $inlines[1] ).find('.default-order-field').val())
        // ];
        var direction = 1; // values[0] > values[1] ? -1 : 1;
        $wrap.data({
            // first_index: values[0],
            direction: direction,
            is_tabular: is_tabular
        });
        $wrap.addClass('admin-sort-wrap');
        var options = {
            draggable: ".is_sortable",
            handle: handle,
            ghostClass: "inline-ghost",
            chosenClass: "inline-chosen",
            onUpdate: update
        }
        if (is_tabular) {
            options.forceFallback = true;
            options.fallbackTolerance = 5;
            options.fallbackClass = 'inline-fallback';
        }
        var sortable = new Sortable($wrap[0], options);
    };

    function add_row_handler(e) {
        // depends on html structure, bad. but...
        var $wrap = $(e.currentTarget).closest('.sortable-inline').find('.admin-sort-wrap');
        update({'from': $wrap[0]});
    };

    function update(e) {
        var $wrap = $(e.from);
        var $inlines = $wrap.find('.is_sortable');
        var index = 0;  // TODO: enable reverse sorting: calculate first reverse index by counting elements!
        var direction = $wrap.data('direction');
        var is_tabular = $wrap.data('is_tabular');
        for ( var i = 0; i < $inlines.length; i++ ) {
            var $row = $( $inlines[ i ] );
            $row.find('.default-order-field').val( index );
            if( is_tabular ) {
                $row.removeClass('row1 row2')
                    .addClass(i % 2 ? 'row2' : 'row1');
            }
            index += direction;
        }
    };

})( django.jQuery );
