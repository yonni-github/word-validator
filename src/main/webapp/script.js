var word;
	const baseUrl = '//73.93.84.252/tigrigna-editor-rws/v1/';
  //Creating a new XMLHttpRequest object
    var xmlhttp;

    function callServer(method,url, cFunction) {
    	if (window.XMLHttpRequest){
 	        xmlhttp = new XMLHttpRequest(); //for IE7+, Firefox, Chrome, Opera, Safari
 	    } else {
 	        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); //for IE6, IE5
 	    } 
    	//Create a asynchronous server request
	    xmlhttp.open(method, url, true);
    	
    	//read response and invoke relevant call back function 
    	xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4){
        	console.log(xmlhttp.status);
        	if(xmlhttp.status == 200) {
          		cFunction(xmlhttp);
        	}else{
            	alert('Something is wrong !!');
        	}
        }
      };
   	  // send request to server
      xmlhttp.send();
    }

    function convertCallback(xmlhttp) {
    	//let dis = document.getElementById("display");
    	let editable = document.getElementById("editable");
    	//dis.value = dis.value + xmlhttp.responseText;
    	var result = xmlhttp.responseText.trim().split(" ");
		console.log(result);
    	var select = document.createElement("select");
    	select.setAttribute("style", "-webkit-appearance: none; appearance: none;padding-left: 3px; padding-right: 3px; background: transparent; border: none;");
		
    	for (var i=0; i < result.length; i += 1) {
		 var option = document.createElement("option"),
		     text = document.createTextNode(result[i]);
		 option.appendChild(text);
		 select.appendChild(option);
		}
    	
    	document.getElementById("editable").appendChild(select); 
    }
    
    function putValidationCallback(xmlhttp) {			
		console.log(xmlhttp.responseText.trim());
		getWord();
    }
    
    function postValidationCallback(xmlhttp) {			
		console.log(xmlhttp.responseText.trim());
		enableBtns();
    }
    
    function getWordCallback(xmlhttp) {			
    	
		word = xmlhttp.responseText.trim();
		console.log(word);
		document.getElementById("editable").textContent = word;
		enableBtns();
		
    }
    
    document.addEventListener('DOMContentLoaded', function(){
        //let txt = document.getElementById('txt');
        //let editable = document.getElementById("editable");
        //txt.addEventListener('keydown', upThing);   
        //1st - no charcode. no input value added yet
        
        //txt.addEventListener('keypress', upThing);  
        //editable.addEventListener('keypress', upThing); 
        //2nd - charcode. no input value added yet
        
        //txt.addEventListener('keyup', upThing);     
        //3rd - no charcode. input value added
        
        //txt.addEventListener('input', upThing);
        //4th - no charcode but input value accessible/mutable
    });
    
    function upThing(ev){
        let num = ev.charCode;
        let letter = String.fromCharCode(num);
      
        console.log(ev.type, num, letter, ev.target.value);
        if(num == 32 || num == 13){
        	var param = "command=text&" + "data=" + ev.target.value;
            callServer("GET", "ControllerServlet"+"?"+param, convertCallback);
            ev.target.value = '';
        }
    }
    
    function putValidation(value){
    	disableBtns();
    	var param = "?word="+word + "&value="+value;
    	var url = baseUrl + 'validate/putvalidation'+param;
    	console.log(url);
    	callServer("PUT",url, putValidationCallback);
    	
    }
    
    function postValidation(correction, value){
    	disableBtns();
    	var param = "?word="+correction + "&value="+value;
    	var url = baseUrl + 'validate/postvalidation'+param;
    	callServer("POST",url, postValidationCallback);
    	
    }
    
    //get random word from server
    function getWord(){
		var url = baseUrl + 'validate/getword';
		callServer("GET", url, getWordCallback);
    }  
    
    function invalid(){
    	putValidation(-1);
    }
    
    function valid(){
    	putValidation(1);
    }
    
    function notSure(){
    	disableBtns();
    	getWord();
    }
    
    function spellWord(){
    	
    	var correction = prompt("Please enter correction here", "");
    	if (correction != null && correction !== "") {
    		postValidation(correction, 1);
    		invalid();
    	}
    	
    }
    
    function disableBtns() {
    	var x = document.getElementsByClassName("btn");
        var i;
        for (i = 0; i < x.length; i++) {
          x[i].disabled = true;
        }
    }

    function enableBtns() {
        var x = document.getElementsByClassName("btn");
        var i;
        for (i = 0; i < x.length; i++) {
          x[i].disabled = false;
        }
    }
    
    function copyEditorContent(){
      const el = document.createElement('textarea');
		  el.value = word;
		  el.setAttribute('readonly', '');
		  el.style.position = 'absolute';
		  el.style.left = '-9999px';
		  document.body.appendChild(el);
		  el.select();
		  document.execCommand('copy');
		  document.body.removeChild(el);
   }
    
    function initPage(){
    	console.log('page load initialization.');
    	getWord();
    }