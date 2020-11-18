var SortableList = ( function( $ ) {
    'use strict';

    var csrftoken;
    var current_page;
    var messages;
    var sortable;
    var total_pages;
    var reorder_url;
    var update_url;
    var wrap;
    var $items;
    var $reorder;
    var $results;
    var $wrap;

    var handle_class = 'admin-sort-drag';
    var draggable_class = 'draggable-item';
    var reorder_id = 'admin-sort-reorder-link';
    var $doc = $( document );
    var $message = $(
        '<div id="admin-sort-state" class="admin-sort-state">'
        + messages
        + '</div>'
    );

    $doc.ready( init );

    function init() {
        $( '#result_list' ).addClass( 'sortable-list' );
        $results = $( '.results' );
        $wrap = $( '#result_list tbody' );
        $reorder = $( '#' + reorder_id );

        if( $wrap.length > 0 ) {

            // set sortablejs
            wrap = $wrap[ 0 ];
            $items = $( '.row1, .row2', $wrap ).each( init_item );
            sortable = new Sortable( wrap, {
                draggable: "." + draggable_class,
                handle: '.' + handle_class,
                ghostClass: "admin-sort-ghost",
                chosenClass: "admin-sort-chosen",
                onUpdate: update
            } );

            // set reorder link
            $reorder.off().on( 'click', send_reorder_request)
        }
    };


    // Sortable --------------------------------------------------------------

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
        this.$.removeClass( 'row1 row2' );
        this.$.addClass( i % 2 == 0 ? 'row1' : 'row2' );
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
            set_loading( messages.sorting );
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
                unset_loading();
            } );
        }
    };


    // Reorder ---------------------------------------------------------------

    function send_reorder_request( e ) {
        if( e ) {
            e.preventDefault();
        }
        var data = {
            csrfmiddlewaretoken: csrftoken
        };
        set_loading( messages.reordering );
        $.ajax( {
            url: reorder_url,
            type: 'POST',
            data: data
        } ).fail( function() {
            show_error( 'there has been a problem reordering the items' );
        } ).done( function( data ) {$results
            if( data.message === 'error' ) {
                show_error( data.error );
            }
            unset_loading();
            window.location.reload(false);
        } );
    };


    // States ----------------------------------------------------------------

    function set_loading( message ) {
        $message.html(
            '<span class="msg">' + message + '</span>'
            + '<span class="admin-sort-loader">'
            + '<span class="admin-sort-loader-inner"></span>'
            + '</span>'
        );
        $results.append( $message );
    };

    function unset_loading() {
        $message.remove();
    };


    // Messaging -------------------------------------------------------------

    function show_error( msg ) {
        // TODO implement nice html message
        console.error( msg );
    };


    // Utilities -------------------------------------------------------------

    function set_options( options ) {
        // TODO check if option has value & do proper init or error handling
        csrftoken = options.csrftoken;
        current_page = options.current_page;
        total_pages = options.total_pages;
        update_url = options.update_url;
        reorder_url = options.reorder_url;
        messages = options.messages;
    };

    return {
        options: set_options
    };

} )( django.jQuery );