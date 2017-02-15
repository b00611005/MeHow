'use strict';
var lastEmojiId = 0;
var text ="";
// Call this function when the page loads (the "ready" event)
     $(document).ready(function() {
	    $("#datepicker").datepicker({
	            changeMonth: true,
	            changeYear: true,
	    })
	    .hide()
	    .click(function() {
	      $(this).hide();
	    })
			pushpad('init', 2931);
			pushpad('subscribe');
	    ;

	    $("#calendar-button").click(function() {
	       $("#datepicker").toggle(); 
	    });

	    $(".emoji_ADDPAGE").click(function(){
	    	//Draw the clicked one.
    		$(this).attr("class","selected");
    		var EmojiId = $(this).attr("id");
    		//Undraw the last one.
    		if(EmojiId!=lastEmojiId)
    			$("#"+lastEmojiId).removeAttr("class","selected");
	    	//Update EmojiId
	    	lastEmojiId = EmojiId;
	    	console.log(EmojiId);
	    });

	    $("#memoButton").click(function(){
	    	console.log("memoButton clicked");
	    	$("#textareaAtAdd").toggle();
	    	goToBottom();
	    });

	    $("#cameraButton").click(function(){
	    	console.log("cameraButton clicled");
	    });

	    $("#recorderButton").click(function(){
	    	console.log("recorderButton clicked");
	    });

	    $("#textareaAtAdd").hide();
	});

    function goToBottom(){
		var documentHeight=document.documentElement.offsetHeight;
		var viewportHeight=window.innerHeight;
		window.scrollTo(0,documentHeight-viewportHeight);
	} 

/*
 * Function that is called when the document is ready.
 */


