$(function() {
    
    // Apply additional wet css classes to any document elements of
    // class errorMessage.  (Works in tandem with struts2 fielderror tag.) 
    $(".errorMessage").addClass("strong error list-unstyled mrgn-bttm-0");
    $(".errorMessage li").addClass("label label-danger label-error");
    
    // Accessibility:  place focus on the "There are validation errors" message if it exists 
    $( ".alert.alert-danger > h2 " ).attr( "tabindex", "0").focus().css( "outline", "0" );    
});

/**
 * jQuery html5type plugin.  (Allows struts1 apps to use the HTML5 types.)
 */
(function($) {
    $.fn.useHtml5Type = function(options) {
               
        return this.each(
              function() {
                var $this = $(this);
                
                try {
                     $this.attr(options);
                } catch(err) {
                    // Older browsers like IE8 don't let you change
                    // the type attribute of an input.
                    //
                    // We'll break out briefly into regular javascript
                    // to retrieve the attributes as an array, then transfer
                    // the array of attributes into the options map
                    // without overriding any keys that already exist
                    // in the map.
                    //
                    // Note that this is not a deep clone operation, 
                    // so if you have defined event handlers on the  
                    // original input, they won't survive the transition.
                    var attributes = $this.get(0).attributes;
                           
                    for(i = 0; i < attributes.length; i++) {
                        if( options[attributes[i].name] == null ) {
                            options[attributes[i].name] = attributes[i].value;
                        }
                    }

                    // now create a brand new input element, add it to the
                    // dom, and remove the old one.
                    $("<input/>").attr(options).insertAfter($this).prev().remove();
                }
            }
        );
    }
})(jQuery);
