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

  // function that should be moved as a helper class or something
  var componentName = "wb-calc",
      selector = "." + componentName,
      initEvent = "wb-init" + selector,
      $document = wb.doc,
      isSelector,
      getEquation,
      tokenize,
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
          settings,
          tokens = [],
          position = 0,
          peek = function() {
            return tokens[ position ];
          },
          consume = function() {
            position++;
          },
          parsePrimaryExpr = function() {
            var token = peek();
          
            if ( isNumber( token ) ) {
              consume( token );
              return { 
                type: "number",
                value: token 
              };
            } else if ( isElement( token ) ) {
              consume( token );
              return { 
                type: "name",
                id: token
              };
            } else if ( isSelector( token ) ) {
              if ( token.startsWith( "#" ) || token.startsWith( "." ) ) {
                var $elm = $( token );
          
                token = ( !$elm.is( "select" ) ) ? $( token ).val() : $( token + " option:selected" ).attr( "data-wb-calc-value" );
              }
              consume( token );
              return { 
                type: "number",
                value: token
              };
            } else if ( token === "(" ) {
              consume( token );
              var expr = parseExpr();
              if ( peek() !== ")" ) {
                throw new SyntaxError( "expected )" );
              }
              consume( ")" );
              return expr;
            } else {
              throw new SyntaxError( "expected a number, a variable, or parentheses" );        
            }
          },
          parseMulExpr = function() {
            var expr = parsePrimaryExpr(),
                t = peek();

            while ( t === "*" || t === "/" ) {
              consume( t );
              var rhs = parsePrimaryExpr();
              expr = { type: t, left: expr, right: rhs };
              t = peek();
            }
            return expr;
          },
          parseExpr = function() {
            var expr = parseMulExpr(),
                t = peek();

            while ( t === "+" || t === "-" ) {
              consume( t );
              var rhs = parseMulExpr();
              expr = { type: t, left: expr, right: rhs };
              t = peek();
            }
            return expr;
          },
          compute = function( evalObj ) {
            var retVal;
            switch ( evalObj.type ) {
            case "number": return parseFloat( evalObj.value );
            case "name": return evalObj.id;
            case "+":
              retVal = compute( evalObj.left ) + compute( evalObj.right );
              return retVal;
            case "-":
              retVal = compute( evalObj.left ) - compute( evalObj.right );
              return retVal;
            case "*":
              retVal = compute( evalObj.left ) * compute( evalObj.right );
              return retVal;
            case "/":
              retVal = compute( evalObj.left ) / compute( evalObj.right );
              return retVal;
            }
          };

      isSelector = function( token ) {
        return token !== undefined && token.match(/^(([a-z0-9\[\]=\-:]+\s?)|((#|\.){1}[a-z0-9\-_\s?:]+\s?)+)$/) !== null;
      };
      
      tokenize = function( expr ) {
        var results = [],
            tokenRegEx = /\s*([#.A-Za-z]+|[+-]?([0-9]*[.])?[0-9]+|\S)\s*/g,
            token;

        while ( (token = tokenRegEx.exec( expr ) ) !== null ) {
          results.push( token[ 1 ] );
        }
      
        return results;
      };

      getEquation = function( jsonData ) {
        var equation = jsonData.equation,
            eqNum = jsonData.eqnum;

        if ( typeof eqNum !== "undefined" ) {
          var idxVal = $( "input:radio[name=" + eqNum + "]:checked" ).val();

          equation = jsonData.equation[ idxVal - 1 ];
        }
      
        return equation;
      };

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
            return ( window.Math );
          }
        })
        // Call my custom event
        $elm.trigger( "change", settings );
        // Identify that initialization has completed
        wb.ready( $elm, componentName );
      }
    };

  // Add your plugin event handler
  $document.on( "submit", selector, function ( event ) { // Event onSubmit use at the moment to avoid unintentional divide 0 operations 
    event.preventDefault();

    var $elm = $( this ),
        bind = $elm.attr( "data-wb-calc-bind" ),
        $calculations = $( bind );

    $calculations.each( function() {
      var $calcelm = $( this ),
          jsonData = JSON.parse( $calcelm.attr( "data-wb-calc" ) ),
          equation = getEquation( jsonData ),
          roundDigits = jsonData.rounded,
          value = compute( parse( equation ) );

      if ( typeof roundDigits !== "undefined" ) {
        value = value.toFixed( parseInt( roundDigits ) );
      }
      $calcelm.text( value );
    } );

    return false;
  });

  $document.on("change", "output." + selector, function( event, data ) {
    var elm = event.currentTarget,
        $elm = $( elm ),
        $input = $("#" + $elm.attr("for")),
        value = $input.val(),
        parse = function( equation ) {
          tokens = tokenize( equation );
          position = 0;

          var result = parseExpr();

          return result;
        };

    if (data && data.format === "currency") {
      $elm.html( toMoney.format(value * 1) );
    } else {
      $elm.html( value * 1 );  
    };
  } );
 
  // Bind the init event of the plugin
  $document.on( "timerpoke.wb " + initEvent, selector, init );
  // Add the timer poke to initialize the plugin
  wb.add( selector );
  } )( jQuery, window, wb );