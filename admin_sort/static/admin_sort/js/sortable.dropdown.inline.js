var SortableInline = ( function( $ ) {
    'use strict';

    /*
    TODO implement Inline extra even if imho this is crap
    */

    var $inlines;
    var $doc = $( document );

    var generic_row_class = 'admin-sort-row';

    $doc.ready( init );

    function init() {
        $inlines = $( '.admin-sort-dropdown-inline' );
        $inlines.each( init_inline );
    };

    function init_inline() {

        /*
        inl.$: $(this)
        inl._field: name of position field
        inl.$add: add row element
        inl.$rows: all visible inline rows
         */

        var inl = this;
        inl.$ = $( this );
        inl._field = inl.$.data( 'admin-sort-position-field' );
        inl.$add = inl.$.find( '.add-row' );
        inl.$add.on( 'click', on_row_add );

        if( inl.$.hasClass( 'admin-sort-tabular' ) ) {
            inl.set_class = 'fieldset.module tbody';
            inl.row_class = '.form-row';
        } else {
            inl.set_class = 'fieldset.module';
            inl.row_class = '.inline-related';
        }

        inl.$set = $( inl.set_class, inl.$ );
        inl.$rows = $( inl.row_class, inl.$set );
        // inl.$rows.data( { field: inl.$.data( 'field' ) } );
        // console.log(inl.$rows);
        inl.$rows.each( init_row );

        // function init_tabular() {
        //     inl.$set = $( 'fieldset.module tbody', inl.$ );
        //     inl.$rows = $( '.form-row', inl.$set );
        //     inl.$rows.addClass( row_class );
        //     inl.$rows.data( { field: inl.$.data( 'field' ) } );
        //     inl.$rows.each( init_row );
        // };
        //
        // function init_stacked() {
        //     inl.$set = $( 'fieldset.module', inl.$ );
        //     inl.$rows = $( '.inline-related', inl.$set );
        //     inl.$rows.addClass( row_class );
        //     inl.$rows.data( { field: inl.$.data( 'field' ) } );
        //     inl.$rows.each( init_row );
        // };

        function get_sortable_rows() {
            if (inl.$.hasClass('has-extra')) {
                return inl.$rows.filter('.has_original');
            } else {
                return inl.$rows.filter(':visible');
            }
        }

        function init_row( i ) {
            // this = an inline row
            this.$ = $( this );
            this.$.addClass( generic_row_class );
            this.$position = $( '.admin-sort-position',  this.$ );
            var $pos = this.$position;
            $pos.empty();
            // console.log(inl.$rows.length);
            var $sortable_rows = get_sortable_rows();
            if (i + 1 > $sortable_rows.length) {
                $pos.append(new Option('-', ''));
            } else {
                $.each($sortable_rows, function (j) {
                    var option = new Option(j + 1, j + 1);
                    $pos.append($(option));
                })
                var index_1 = i + 1;
                $pos.val(index_1);
                $pos.data('previous-value', index_1);
                // dont register twice, after add row!
                $pos.off('change');
                $pos.on('change', on_position_change);
            }
            return this;
        };

        function set_positions( e ) {
            inl.$rows = $( '.' + generic_row_class, inl.$ );
            inl.$rows.each( init_row );
        };

        function on_row_add(e) {
            // inl.$rows = $( inl.row_class, inl.$set );
            // add new <option> to all position fields
            inl.$rows = $( inl.row_class, inl.$set );
            // console.log(inl.$rows.length);
            inl.$rows.each( init_row );
        };

        function on_position_change(e) {
            // this = position select
            this.$ = $( this );
            var value = parseInt(this.$.val());
            var previous_value = parseInt(this.$.data('previous-value'));
            var target_index = value - 1;
            var $my_row = this.$.closest(inl.row_class);
            // find row to insert before / after
            var $target_row = inl.$rows.eq(target_index);
            if (target_index < previous_value) {
                $my_row.insertBefore($target_row);
            } else {
                $my_row.insertAfter($target_row);
            }
            // update selects!
            inl.$rows = $( inl.row_class, inl.$set );
            inl.$rows.each( init_row );
        }

        return inl;
    };
} )( django.jQuery );