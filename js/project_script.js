var   window_height = jQuery(window).height(),
    loadingError = '<p class="alert">The Content cannot be loaded.</p>',
    current,
    next, 
    prev,
    target, 
    hash,
    url,
    page,
    title,
    projectIndex,
    scrollPosition,
    projectLength,
    ajaxLoading = false,
    wrapperHeight,
    pageRefresh = true,
    content = false,
    loader = jQuery('div#project_loader'),
    portfolioGrid = jQuery('div.portfolio_wrapper'),
    projectContainer = jQuery('div#project_container'),
    projectNav = jQuery('#project_nav ul'),
    exitProject = jQuery('div#close_project a'),
    easing = 'easeOutExpo',
    folderName ='projects',
	player;
	


// Load project working when project
(function(jQuery){
  "use strict";
  // checks everytime hash changes in the URL bar
  jQuery(window).bind( 'hashchange', function() {
 
	// getting the hash address
	hash = jQuery(window.location).attr('hash'); 
	var root = '#!'+ folderName +'/';
	var rootLength = root.length;	
 
    // if hash length is zero then will stop working and not equal to the #![folder_name] (#!projects)
	if( hash.substr(0,rootLength) != root ){
		return;						
  }else{  //if hash length is equal to the #![folder_name] (#!projects)

		var correction = 50;
		var headerH = jQuery('.portfolio_nav').outerHeight()+correction;
		hash = jQuery(window.location).attr('hash'); 
		url = hash.replace(/[#\!]/g, '' ); 
		 
		 
       
		portfolioGrid.find('div.isotope-item.current').find('.view').removeClass('active');
		portfolioGrid.find('div.isotope-item.current').removeClass('current' );
		
		// check whther URL is pasted in URL bar and page is refreshed
		if(pageRefresh === true && hash.substr(0,rootLength) ==  root){	
			jQuery('html,body').stop().animate({scrollTop: (projectContainer.offset().top-20)+'px'},1500,'easeOutExpo', function(){											
				loadProject();																									
			});
				
		// else checking whether clicked on portfolio in portfolio section or in header or through navigation, all works same
		}else if(pageRefresh === false && hash.substr(0,rootLength) == root){				
			jQuery('html,body').stop().animate({scrollTop: (projectContainer.offset().top-headerH)+'px'},1500,'easeOutExpo', function(){
	
				if(content === false){						
					loadProject();							
				}else{	
					projectContainer.animate({opacity:0,height:wrapperHeight},function(){
					loadProject();
					});
				}
						
				projectNav.fadeOut('100');
				exitProject.fadeOut('100');
						
			});
			
		// else checking whether brwosers back button is used
		}else if(hash==='' && pageRefresh === false || hash.substr(0,rootLength) != root && pageRefresh === false || hash.substr(0,rootLength) != root && pageRefresh === true){	
			scrollPosition = hash; 
			console.log(scrollPosition);
			jQuery('html,body').stop().animate({scrollTop: scrollPosition+'px'},1000,function(){				
				deleteProject();								
			});
		}
		
		
		
		// adding active and current classes to the currently active portfolio item in 1-Portfolio section 
    portfolioGrid.find('div.isotope-item .single_work .links a[href="#!' + url + '"]' ).closest('.isotope-item').addClass( 'current' ); // for Porfolio section
    portfolioGrid.find('div.isotope-item.current').find('.view').addClass('active');	// for Porfolio section
		 
	
  }

	});
	
	// Function for loading project
	function loadProject(){
		//var player="";
		//player.dispose();
		if(jQuery('#project_ajax_content').find('.video_post').length>0){
			console.log("Disposed");
			player.dispose();
		}
		loader.fadeIn().removeClass('projectError').html('');
		if(!ajaxLoading) {				
			ajaxLoading = true;
			projectContainer.load( url +' div#project_ajax_content', function(xhr, statusText, request){
				if(statusText == "success"){				
					ajaxLoading = false;
					page =  jQuery('div#project_ajax_content');
					
					if(jQuery('#project_ajax_content').find('.rslides').length>0){		
						jQuery(".rslides").responsiveSlides({
											auto: true,
											pager: true,
											nav: true,
											speed: 500,
											maxwidth: 1170,
											prevText: "",
											nextText: "",
											namespace: "transparent-btns"
						});
						console.log('rslides');
					}

          			hideLoader();
					
					if(jQuery('#project_ajax_content').find('.v_y_video_post').length>0){
						jQuery(".featured_image").fitVids();
						console.log('fitvideos');
					}
					
					if(jQuery('#project_ajax_content').find('.video_post').length>0){		
						jQuery(".featured_image").fitVids();
						var video_div = jQuery('#project_ajax_content').find('.video-js')
						player = videojs(video_div[0], {}, function(){
						  // Player (this) is initialized and ready.
						});	
						console.log(video_div);
						
					}
					
						
				}
					
				if(statusText == "error"){
				
						loader.addClass('projectError').append(loadingError);
						
						loader.find('p').slideDown();

				}
				 
			});
			
		}
		
	}
		

	// function for hiding the loader  and displaying the project in place of it
	function hideLoader(){
		loader.fadeOut('fast', function(){
			showProject();					
		});			 
	}	
		
	// displaying the loaded project	
	function showProject(){
		if(content===false){
			wrapperHeight = projectContainer.children('div#project_ajax_content').outerHeight()+'px';
			projectContainer.animate({opacity:1,height:wrapperHeight}, function(){
				jQuery(".featured_image").fitVids();
				scrollPosition = jQuery('html,body').scrollTop();
				projectNav.fadeIn();
				exitProject.fadeIn();
				content = true;	
						
			});
		}else{
			wrapperHeight = projectContainer.children('div#project_ajax_content').outerHeight()+'px';
			projectContainer.animate({opacity:1,height:wrapperHeight}, function(){																						
				jQuery(".featured_image").fitVids();
				scrollPosition = jQuery('html,body').scrollTop();
				projectNav.fadeIn();
				exitProject.fadeIn();
			});					
		}

		projectIndex = portfolioGrid.find('div.isotope-item.current').index();
		projectLength = jQuery('div.isotope-item').length-1;

		if(projectIndex == projectLength){
			jQuery('ul li#next_project a').addClass('disabled');
			jQuery('ul li#previous_project a').removeClass('disabled');
			
		}else if(projectIndex === 0){
			jQuery('ul li#previous_project a').addClass('disabled');
			jQuery('ul li#next_project a').removeClass('disabled');
			
		}else{
			jQuery('ul li#next_project a,ul li#previous_project a').removeClass('disabled');
			
		}
	}
	
	// fucntion for deleting the project from the displayed section
	function deleteProject(closeURL){
		projectNav.fadeOut(100);
		exitProject.fadeOut(100);				
		projectContainer.animate({opacity:0,height:'0px'});
		projectContainer.html('');
			
		if(typeof closeURL!='undefined' && closeURL!=='') {
			location = '#_';
		}
		portfolioGrid.find('div.isotope-item.current').find('.view').removeClass('active');
		portfolioGrid.find('div.isotope-item.current').removeClass('current' );
		
	}

	// working of project navigation for next project
	jQuery('#next_project a').on('click',function () {
		current = portfolioGrid.find('.isotope-item.current');
		next = current.next('.isotope-item');
		target = jQuery(next).children('div').find('a').attr('href');
		jQuery(this).attr('href', target);
		
		if (next.length === 0) { 
			return false;
		} 
		current.find('.view').removeClass('active');
		current.removeClass('current'); 
		next.addClass('current');
		next.find('.view').addClass('active');
	});

	// working of project navigation for next project
	jQuery('#previous_project a').on('click',function () {
		current = portfolioGrid.find('.isotope-item.current');
		prev = current.prev('.isotope-item');
		next = current.next('.isotope-item');
		target = jQuery(prev).children('div').find('a').attr('href');
		jQuery(this).attr('href', target);
		
		if (prev.length === 0) {
			return false;
		}
		
		
		current.removeClass('current');  
		current.children().removeClass('active');
		prev.addClass('current');
		prev.children().addClass('active');
		
		current.find('.view').removeClass('active');
		current.removeClass('current'); 
		next.addClass('current');
		next.find('.view').addClass('active');
		
	});
		
		
	// working of closing the project it will delete the project in ajax project section
	jQuery('#close_project a').on('click',function () {
		deleteProject(jQuery(this).attr('href'));
		loader.fadeOut();
		return false;
	});
	
  pageRefresh = false;

})(jQuery);

// when window is loaded then check that if haschange is trigerred in URL or window is resized so that project can be loaded		 
jQuery(window).load(function(){
	jQuery('#load').fadeOut().remove();
	jQuery(window).trigger( 'hashchange' );
	jQuery(window).trigger( 'resize' );
});
	
// projectContainer height is resized everytime browser window is resized
jQuery(window).bind('resize',function(){						
	jQuery(projectContainer).css({height:'auto'});										 
});
