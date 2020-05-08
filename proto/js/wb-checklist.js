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
  var componentName = "wb-calc",
      selector = "." + componentName,
      initEvent = "wb-init" + selector,
      $document = wb.doc,
      /**
       * @method init
       * @param {jQuery Event} event Event that triggered the function call
       */
      init = function( event ) {
        // Start initialization
        // returns DOM object = proceed with init
        // returns undefined = do not proceed with init (e.g., already initialized)
        var elm = wb.init( event, componentName, selector ),
            $elms,
            Checkbox = function (domNode) {

              this.domNode = domNode;
              this.controlledCheckboxes = [];
            
              this.keyCode = Object.freeze({
                'RETURN': 13,
                'SPACE': 32
              });
            };

        if ( elm ) {
          $elms = $("[role='checkbox']");
          // ... Do the plugin initialisation
          for (let i = 0; i < $elm.length; i++) {
            const elm = new Checkbox($elms[i]);
            elm.init();
          }

          // Call my custom event
          $elm.trigger( "keydown", "click", "focus", "blur" );
          // Identify that initialization has completed
          wb.ready( $elm, componentName );
        }
      },
      toggleCheckbox = function (event) {
        if (this.domNode.getAttribute('aria-checked') === 'false') {
          this.domNode.setAttribute('aria-checked', 'true');
        }
        else {
          this.domNode.setAttribute('aria-checked', 'false');
        }
        updateChecklistReady();
      },
      handleKeydown = function (event) {
        var flag = false;

        switch (event.keyCode) {
          case this.keyCode.SPACE:
            this.toggleCheckbox();
            flag = true;
            break;
          default:
            break;
        }

        if (flag) {
          event.stopPropagation();
          event.preventDefault();
        }
      },
      handleClick = function (event) {
        this.toggleCheckbox();
      },
      handleFocus = function (event) {
        this.domNode.classList.add('focus');
      },
      handleBlur = function (event) {
        this.domNode.classList.add('focus');
      };
  // Add your plugin event handler
  $document.on( "keydown", "[role='checkbox']", function( event ) {
    var elm = event.currentTarget,
        $elm = $( elm );
    $elm.handleKeydown.bind($elm);
  } );

  $document.on( "click", "[role='checkbox']", function( event ) {
    var elm = event.currentTarget,
        $elm = $( elm );
    $elm.handleClick.bind($elm);
  } );

  $document.on( "focus", "[role='checkbox']", function( event ) {
    var elm = event.currentTarget,
        $elm = $( elm );
    $elm.handleFocus.bind($elm);
  } );

  $document.on( "blur", "[role='checkbox']", function( event ) {
    var elm = event.currentTarget,
        $elm = $( elm );
    $elm.handleBlur.bind($elm);
  } );
 
  // Bind the init event of the plugin
  $document.on( "timerpoke.wb " + initEvent, selector, init );
  // Add the timer poke to initialize the plugin
  wb.add( selector );
  } )( jQuery, window, wb );