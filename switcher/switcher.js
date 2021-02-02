/* Styles Switcher*/

window.console = window.console || (function(){

  var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};

  return c;

})();

  jQuery(document).ready(function($) {
    "use strict";    
	var path = $(location).attr('pathname');

    $('select[name="URL"] option').each(function() 
		{
		  if(path.indexOf($(this).val()) >= 0){
			$(this).attr('selected', 'selected');
		  }
		});

    var color_presets_html = $.cookie('color_presets_html');

    // Checking if color presets in cookie then set it
    if(color_presets_html>''){
      $("link#predefined_color_theme_css").attr("href", 'css/colors/'+color_presets_html+'.css');
      $('#color1 [href^="'+color_presets_html+'"]').parent().parent().find('a').removeClass('active');
      $('#color1 [href^="'+color_presets_html+'"]').addClass('active');
     }

    $("#color1 a").click(function(e) {
      e.preventDefault();
      color_presets_html = $(this).attr('href');
      $.cookie("color_presets_html",color_presets_html, {expires: 7, path: '/'});
      $("link#predefined_color_theme_css").attr("href", 'css/colors/'+color_presets_html+'.css');
      return false;
    });
    $('.colors li a').click(function(e){
      e.preventDefault();
      $(this).parent().parent().find('a').removeClass('active');
      $(this).addClass('active');
    });

    // Reseting to default
    $('#reset a').click(function(){

      // deleting cookies
    $("#color1 li:first-child a").click();
      $.removeCookie('color_presets_html', { path: '/' });
    });

    // Style Switcher	
    $('#style-switcher').animate({
      left: '-290px'
    });

    $('#style-switcher h2 a').click(function(e){
      e.preventDefault();
      var div = $('#style-switcher');
      if (div.css('left') === '-290px') {
        $('#style-switcher').animate({
          left: '0px'
        }); 
      } else {
       $('#style-switcher').animate({
          left: '-290px'
        });
      }
    });
  });