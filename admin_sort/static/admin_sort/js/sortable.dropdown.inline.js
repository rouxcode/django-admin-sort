var SortableInline = ( function( $ ) {
    'use strict';

    /*
    TODO implement Inline extra even if imho this is crap
    */

    var $inlines;
    var $doc = $( document );

    var row_class = 'admin-sort-row';

    $doc.ready( init );

    function init() {
        $inlines = $( '.admin-sort-dropdown-inline' );
        $inlines.each( init_inline );
    };

    function init_inline() {
        var inl = this;
        inl.$ = $( this );
        inl._field = inl.$.data( 'admin-sort-position-field' );
        inl.$add = $( '.add-row' );
        inl.$add.on( 'click', set_positions );

        if( inl.$.hasClass( 'admin-sort-tabular' ) ) {
            init_tabular();
        } else {
            init_stacked();
        }

        function init_stacked() {
            inl.$set = $( 'fieldset.module', inl.$ );
            inl.$rows = $( '.inline-related', inl.$set );
            inl.$rows.addClass( row_class );
            inl.$rows.data( { field: inl.$.data( 'field' ) } );
            inl.$rows.each( init_row );
        };

        function init_tabular() {
            inl.$set = $( 'fieldset.module tbody', inl.$ );
            inl.$rows = $( '.form-row', inl.$set );
            inl.$rows.addClass( row_class );
            inl.$rows.data( { field: inl.$.data( 'field' ) } );
            inl.$rows.each( init_row );
        };

        function init_row( i ) {
            console.log(inl.$rows.length);
            $.each(inl.$rows, function(j) {
                                
            })
            this.$ = $( this );
            // this.$col = $( '.' + inl._field, this.$ );
            // this.$position = $( 'input',  this.$col );
            this.$position = $( '.admin-sort-position',  this.$ );
            // only increment for existing
            if (this.$.hasClass('has_original')) {
                this.$position.val( i + 1 );
            }
            return this;
        };

        function set_positions( e ) {
            inl.$rows = $( '.' + row_class, inl.$ );
            inl.$rows.each( init_row );
        };

        return inl;
    };
} )( django.jQuery );