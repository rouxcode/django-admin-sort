var SortableInline = (function ( $ ) {
    'use strict';

    var $groups;

    $(document).ready( init );

    function init() {
        $groups = $('.sortable-inline');
        if ( $groups.length > 0) {
            for ( var i = 0; i < $groups.length; i++ ) {
                var $group = $( $groups[i] );
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
        var $inlines = $('.inline-related.has_original', $wrap);
        $inlines.append('<div class="drag"></div>');
        $('.inline-related', $wrap).not('.has_original').first().addClass('first-empty');
        if( $inlines.length > 1 ) {
            init_sortable( $wrap, $inlines, '.drag', false );
        }
    };

    function init_tabular( $group ) {
        var $wrap = $('.module tbody', $group);
        var $inlines = $('tr.has_original', $wrap);
        var $head = $('.module thead tr', $group);
        var $first_label = $('th:first');
        $first_label.attr({ colspan: parseInt( $first_label.attr('colspan') ) -1 });
        $head.prepend('<th class="drag-label">&nbsp;</th>');
        $('tr', $wrap).not('.has_original').first().addClass('first-empty');
        if( $inlines.length > 1 ) {
            init_sortable( $wrap, $inlines, '.original', true );
        }
    };

    function init_sortable( $wrap, $inlines, handle, is_tabular) {
        var values = [
            parseInt($( $inlines[0] ).find('.default-order-field').val()),
            parseInt($( $inlines[1] ).find('.default-order-field').val())
        ];
        var direction = values[0] > values[1] ? -1 : 1;
        $wrap.data({
            first_index: values[0],
            direction: direction,
            is_tabular: is_tabular
        });
        var options = {
            draggable: ".has_original",
            handle: handle,
            ghostClass: "inline-ghost",
            chosenClass: "inline-chosen",
            onUpdate: update
        }
        if ( is_tabular ) {
            options.forceFallback = true;
            options.fallbackTolerance = 5;
            options.fallbackClass = 'inline-fallback';
        }
        var sortable = new Sortable( $wrap[0], options);
    };

    function update(e) {
        var $wrap = $( e.from );
        var $inlines = $wrap.find('.has_original');
        var index = $wrap.data('first_index');
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
