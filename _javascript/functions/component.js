var $ = require('jquery')

function containerized_component(patternId) {
  
  // variables
  var pattern = $("#" + patternId);

  
  // What to do when the page loads
  function init() {}

  function setEvents() {}

  // Running the initial and event functions for the Super Menu when the page loads
  function docReady() {
    init();
    setEvents();
  }

  $(document).on({
    ready: docReady()
  });
}

exports.activate = function(selector) {
  $(selector).each(function(){

    var id = $(this).attr('id');
    
    if ( typeof id === typeof undefined && id !== false ) {
      
      id = 'IDUNIQUE_' + Math.floor((Math.random() * 999999999999) + 1);
      $(this).attr('id', id);
    }
    
    containerized_component(id);
  });
}
