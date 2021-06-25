/**
 * After the tabs component has finished its initialization,
 * look for any summary element with a data-mima-taburl attribute.
 * For those that have one, tweak the behaviour to fetch a new
 * page instead of expanding the details/switching tabs.  
 */
var myaTabsInitialized = false;
// this should be all we need to do, but in some cases
// we're not receiving the ready notification.
$( "#tabs" ).on( "wb-ready.wb-tabs", myaTabsInit);

// ask wet to notify us of timerpoke events
$( document ).on( "timerpoke.wb", myaTabsInitCheck(event) );

// timerpoke should happen every 500ms
function myaTabsInitCheck( event ) {

    myaTabsInit(event);

    if( !myaTabsInitialized ) {
        $( document ).unbind( "timerpoke.wb", myaTabsInitCheck);
    }
}

function myaTabsInit( event ) {

    if( myaTabsInitialized ) { 
        return;
    }
    
    var $tabsElement = $("#tabs");
    
    if ( !$tabsElement.hasClass( "wb-tabs-inited" ) ) {
        return;
    }
        
    var $tabs = $('.tabpanels > details > summary', $tabsElement);
    $tabs.each(function() {
        
        var $this = $(this);
        
        // We can add a click event handler directly
        // to the summary element for the responsive view.
        // In the desktop view, the summary/details elements 
        // are swapped out and replaced by li elements with 
        // role='tab', so we need to locate those and add a
        // similar click event handler to them.
        if( $this.attr('data-mima-taburl') ) {
        	$this.on('click keydown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                location.assign($this.attr('data-mima-taburl'));
                sessionStorage.setItem("clickOnTab","yes");
            });
        
            var ix = $tabs.index($this); 
            $("a[role='tab']", $tabsElement).eq(ix).on('click', function(e) {
            	if( e.originalEvent == null && !e.which) {
                    // This was triggered programmatically by the 
                    // wet framework due to a resize.  Ignore it.
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                    location.assign($this.attr('data-mima-taburl'));
                    sessionStorage.setItem("clickOnTab","yes");
                }
            });
        }
    });
    
    $tabsElement.removeClass("hidden-md hidden-lg");
   
    // show the sinForm after the tabs have been loaded
    $("#sinFormDiv").removeClass("wb-inv");
    
    // use HTML5 session storage to track if the user clicked on a tab
    var clickOnTab = sessionStorage.getItem("clickOnTab");
    
    // put focus on active tab if tab was clicked
    if( clickOnTab == "yes" ) {
        // this is desktop view
        $( "li.active > a ").focus();
        // this is mobile view
        $( "details.open > summary ").focus();
    }

    
    sessionStorage.removeItem("clickOnTab");
    
    //run custom js from My Account to handle some Ajax events
    installAjaxEventHandlers($tabsElement);
    
    myaTabsInitialized = true;
}
