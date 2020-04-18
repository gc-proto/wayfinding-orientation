/**
 * @title WET-BOEW Hello world plugin
 * @overview Plugin contained to show an example of how to create your custom WET plugin
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @duboisp
 */
( function( $, window, wb ) {
  "use strict";
  /*
   * Variable and function definitions.
   * These are global to the plugin - meaning that they will be initialized once per page,
   * not once per instance of plugin on the page. So, this is a good place to define
   * variables that are common to all instances of the plugin on a page.
   */
  const toMoney = new Intl.NumberFormat(wb.lang + "-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  var componentName = "wb-calc",
    selector = "." + componentName,
    initEvent = "wb-init" + selector,
    $document = wb.doc,
    defaults = {},

    /**
     * @method init
     * @param {jQuery Event} event Event that triggered the function call
     */
    init = function( event ) {
      // Start initialization
      // returns DOM object = proceed with init
      // returns undefined = do not proceed with init (e.g., already initialized)
      var elm = wb.init( event, componentName, selector ),
        $elm,
        settings;
      if ( elm ) {
        $elm = $( elm );
        // ... Do the plugin initialisation
        // Get the plugin JSON configuration set on attribute data-wb-helloworld
        settings = $.extend(
          true,
          {},
          defaults,
          window[ componentName ],
          wb.getData( $elm, componentName )
        );

        Modernizr.load ({
          load: ["https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.4/math.js"],
          testReady: function() {
            return ( $.fn.format );
          }
        })
        // Call my custom event
        $elm.trigger( "change", settings );
        // Identify that initialization has completed
        wb.ready( $elm, componentName );
      }
    };

  // Add your plugin event handler
  $document.on( "change", "#" + $(selector).attr("for"), function( event ) {
    var elm = event.currentTarget,
        $elm = $( elm ),
        value = $elm.val();

    $("output[for='" + $elm.attr("id") + "']").html( value );
  } );

  $document.on("change", selector, function( event, data ) {
    var elm = event.currentTarget,
        $elm = $( elm ),
        value = $("#" + $(selector).attr("for")).val();

    $elm.html( value * 1 );
  } );
  // Bind the init event of the plugin
  $document.on( "timerpoke.wb " + initEvent, selector, init );
  // Add the timer poke to initialize the plugin
  wb.add( selector );
  } )( jQuery, window, wb );