var SortableList = ( function( $ ) {
    'use strict';

    var csrftoken;
    var current_page;
    var sortable;
    var total_pages;
    var update_url;
    var wrap;
    var $items;
    var $wrap;

    var handle_class = 'admin-sort-drag';
    var draggable_class = 'draggable-item';
    var $doc = $( document );

    $doc.ready( init );

    function init() {
        $( '#result_list' ).addClass( 'sortable-tree' );
        $wrap = $( '#result_list tbody' );
        if( $wrap.length > 0 ) {
            wrap = $wrap[ 0 ];
            $items = $( '.row1, .row2', $wrap ).each( init_item );
            sortable = new Sortable( wrap, {
                draggable: "." + draggable_class,
                handle: '.' + handle_class,
                ghostClass: "sortable-ghost",
                chosenClass: "sortable-chosen",
                onUpdate: update
            } );
        }
    };

    function init_item( i ) {
        var item = this;
        item.$ = $( this );
        item.$drag = $( '.' + handle_class, item.$ );
        item.$.addClass( draggable_class );
        item._opts = {
            index: i,
            pk: item.$drag.data( 'pk' ),
        };
        return item;
    };

    function set_item_index( i ) {
        this._opts.index = i;
        return this
    };

    function update( e ) {
        if ( e.oldIndex != e.newIndex ) {
            var item = e.item;
            var index = e.newIndex;
            var $list = $( '.' + draggable_class, $wrap );
            var data = {
                obj: item._opts.pk,
                csrfmiddlewaretoken: csrftoken
            };
            if( index === 0  ) {
                data.position = 'left';
                data.target = $list[1]._opts.pk;
            } else {
                data.position = 'right';
                data.target = $list[ index - 1 ]._opts.pk;
            }
            $wrap.css( { opacity: '0.25' } );
            $.ajax( {
                url: update_url,
                type: 'POST',
                data: data
            } ).fail( function() {
                show_error( 'there has been a problem sorting the items' );
            } ).done( function( data ) {
                $items = $( '.' + draggable_class, $wrap );
                $items.each( set_item_index );
                if( data.message === 'error' ) {
                    show_error( data.error );
                }
                console.log( data )
                $wrap.css( { opacity: '1' } );
            } );
        }
    };


    // Messaging -------------------------------------------------------------

    function show_error( msg ) {
        // TODO implement nice html message
        console.error( msg );
    }


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
    };

} )( django.jQuery );