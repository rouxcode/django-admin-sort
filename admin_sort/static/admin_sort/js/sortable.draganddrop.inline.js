var SortableDraganddropInline = ( function($ ) {
    'use strict';

    /*
    TODO implement Inline extra even if imho this is crap
    */

    var $inlines;
    var $doc = $( document );

    var drag_class = 'admin-sort-drag';
    var sortable_row_class = 'admin-sort-row';

    $doc.ready( init );

    function init() {
        $inlines = $( '.admin-sort-draganddrop-inline' );
        $inlines.each( init_inline );
    };

    function init_inline() {
        var inl = this;
        inl.$ = $( this );
        inl._field = inl.$.data( 'admin-sort-position-field' );
        inl.$add = $( '.add-row' );
        inl.$add.on( 'click', set_positions );

        if( inl.$.hasClass( 'admin-sort-tabular' ) ) {
            inl.set_class = 'fieldset.module tbody';
            inl.row_class = '.form-row';
            init_tabular();
        } else {
            inl.set_class = 'fieldset.module';
            inl.row_class = '.inline-related';
            init_stacked();
        }

        inl.$set = $( inl.set_class, inl.$ );
        inl.$rows = $( inl.row_class, inl.$set );
        inl.$rows.each( init_row );

        function get_sortable_rows() {
            if (inl.$.hasClass('has-extra')) {
                return inl.$rows.filter('.has_original');
            } else {
                return inl.$rows;  // .filter(':visible');
            }
        }

        function generic_init_inline() {
            inl.$set = $( inl.set_class, inl.$ );
            inl.$rows = $( inl.row_class, inl.$set );
            inl.$rows.each( init_row );
            if (inl.$.hasClass('has-extra')) {
                inl.$rows.filter('.has_original').addClass( sortable_row_class );
            } else {
                inl.$rows.addClass( sortable_row_class );
            }
        }

        function init_stacked() {
            generic_init_inline();
            get_sortable_rows().append( '<div class="' + drag_class + '" />' );
            init_sortable( inl );
        };

        function init_tabular() {
            generic_init_inline();
            get_sortable_rows().find('.original').append( '<div class="' + drag_class + '" />' );
            init_sortable( inl );
        };

        function init_row( i ) {
            this.$ = $( this );
            this.$position = $( '.admin-sort-position',  this.$ );
            var $sortable_rows = get_sortable_rows();
            if (i < $sortable_rows.length) {
                this.$position.val(i + 1);
            }
            return this;
        };

        function init_sortable() {
            inl._sortable = new Sortable( inl.$set[0], {
                draggable: '.' + sortable_row_class,
                handle: '.' + drag_class,
                onUpdate: set_positions,
                ghostClass: 'admin-sort-ghost',
                chosenClass: 'admin-sort-chosen',
            } );
        };

        function set_positions( e ) {
            inl.$rows = $( inl.row_class, inl.$ );
            inl.$rows.each( init_row );
        };

        return inl;
    };
} )( django.jQuery );