	var word;
	var validScore;
	var invalidScore;
	var mode;
	const baseUrl = '//73.93.84.252/tigrigna-editor-rws/v1/';
  // Creating a new XMLHttpRequest object
    var xmlhttp;

    function callServer(method,url, cFunction) {
    	if (window.XMLHttpRequest){
 	        xmlhttp = new XMLHttpRequest(); // for IE7+, Firefox, Chrome, Opera,
											// Safari
 	    } else {
 	        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // for IE6, IE5
 	    } 
    	// Create a asynchronous server request
	    xmlhttp.open(method, url, true);
    	
    	// read response and invoke relevant call back function
    	xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4){
        	console.log(xmlhttp.status);
        	if(xmlhttp.status == 200) {
          		cFunction(xmlhttp);
        	}else{
            	alert('Remote Server Down. Please check back later!!');
        	}
        }
      };
   	  // send request to server
      xmlhttp.send();
    }

    function convertCallback(xmlhttp) {
    	// let editable = document.getElementById("editable");
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
		// console.log(xmlhttp.responseText.trim());
    	if(mode === 'single')
    		getWord();
    }
    
    function postValidationCallback(xmlhttp) {			
		// console.log(xmlhttp.responseText.trim());
		enableBtns();
    }
    
    function getWordCallback(xmlhttp) {			
    	var json = JSON.parse(xmlhttp.responseText);
		word = json.value;
		validScore = parseInt(json.validity.valid);
		invalidScore = parseInt(json.validity.invalid);
		console.log("Word is= " + word);
		console.log("Validity Score " + (validScore+invalidScore));
		console.log("Valid= " + validScore);
		console.log("Invalid= " + invalidScore);
		document.getElementById("editable").textContent = word;
		document.getElementById("totalScore").textContent = (validScore + invalidScore);
		document.getElementById("invalidScore").textContent = invalidScore;
		document.getElementById("validScore").textContent = validScore;
		enableBtns();
		
    }
    
    document.addEventListener('DOMContentLoaded', function(){
        // let txt = document.getElementById('txt');
        // let editable = document.getElementById("editable");
        // txt.addEventListener('keydown', upThing);
        // 1st - no charcode. no input value added yet
        
        // txt.addEventListener('keypress', upThing);
        // editable.addEventListener('keypress', upThing);
        // 2nd - charcode. no input value added yet
        
        // txt.addEventListener('keyup', upThing);
        // 3rd - no charcode. input value added
        
        // txt.addEventListener('input', upThing);
        // 4th - no charcode but input value accessible/mutable
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
    
    //PUT send as POST to by pass CORS issue
    function putValidation(value){
    	disableBtns();
    	var param = "?word="+word + "&value="+value;
    	var url = baseUrl + 'validate/putvalidation'+param;
    	//console.log(url);
    	callServer("POST",url, putValidationCallback);
    	
    }
    
    function postValidation(correction, value){
    	disableBtns();
    	var param = "?word="+correction + "&value="+value;
    	var url = baseUrl + 'validate/postvalidation'+param;
    	callServer("POST",url, postValidationCallback);
    	
    }
    
    // get random word from server
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
    	mode = 'single';
    	getWord();
    }
    
    // ------------for Batch validation specific functions------
    
    
    // process user input on word batch and pass to server accordingly
    function onNext(){
    	disableBtns();
    	let list = document.getElementById("list");
    	var node = document.getElementById("list").firstChild;
    	//console.log(list.childNodes.length); // for some weird reason list
												// comes with an extra one more
												// child node
    	node = node.nextSibling;
    	while(node){
    		
    		word = node.firstChild.textContent;
    		//console.log(word); 
    		var bottom = node.firstChild.nextSibling;
    		var radios = bottom.getElementsByTagName("INPUT");
    		//console.log(radios);
    		
    		for (const rb of radios) {
                if (rb.checked) {
                    if(rb.value === "vl"){
                    	valid();
                    }else if(rb.value === "iv"){
                    	invalid();
                    }
                    break;
                }
            }
    		var temp = node;
    		node = node.nextSibling;
    		temp.remove(); //remove node/card so that DOM could repaint on next batch
    		
    	}
    	getBatchWords();
    }
    
    // get random batch words from server
    function getBatchWords(){
		var url = baseUrl + 'validate/getbatch';
		callServer("GET", url, getBatchWordsCallback);
    }  
    
    function makeRadioButton(color,name, value, text) {

        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;

        label.style.marginLeft = "6%";
        label.style.marginRight = "7%";
        label.style.marginTop = "2%";
        label.style.backgroundColor=color;
        label.style.padding="2px";
        label.appendChild(radio);

        label.appendChild(document.createTextNode(' '+text));
        return label;
      }
    
    function makeBadge(color, value, text) {
        var badge = document.createElement("h4");
        var span = document.createElement("span");
        span.innerHTML = ' ['+text +' ' +value+'] ';
        span.style.backgroundColor=color;
        span.style.marginLeft = "6%";
        span.style.marginRight = "6%";
        span.style.marginBottom = "2%";
        span.style.padding="2px";
        return badge.appendChild(span);
      }

    function getBatchWordsCallback(xmlhttp) {	
    	console.log("got words batch....!")
    	var json = JSON.parse(xmlhttp.responseText);
    	let list = document.getElementById("list");
    	
    	for (var i=0; i < json.length; i += 1) {
    		word = json[i].value;
    		validScore = parseInt(json[i].validity.valid);
    		invalidScore = parseInt(json[i].validity.invalid);
    		
    		var card = document.createElement("div");
    		card.style.width = "100%";
    		card.style.margin = "1%";
    		card.style.border= "medium solid black";
    		card.style.borderRadius = "2%";
    		card.style.alignContent = "center";
    		
    		var top = document.createElement("div");
    		top.setAttribute('class', 'container');
    		top.setAttribute('id', 'top');
    		top.style.width = "100%";
    		top.style.margin = "1%";
    		top.style.borderBottom = "thin dotted black";
    		top.style.font = "25px arial,serif";
    		top.style.alignItems = "center";
    		top.textContent = word;
    		
    		card.appendChild(top);
    		
    		var bottom = document.createElement("div");
    		bottom.setAttribute('id', 'bottom');
    		var tvs = makeBadge('#33CCCC',(validScore + invalidScore), 'V-Score');
    		var ivs = makeBadge('#fff717',(invalidScore), 'Invalid');
    		var vls = makeBadge('#94ffb4',(validScore), 'Valid');
   		 	bottom.appendChild(tvs);
   		 	bottom.appendChild(ivs);
   		 	bottom.appendChild(vls);
   		 	
   		 	var newline = document.createElement('br');
   		 	bottom.appendChild(newline);
   		 	
   		 	var ns = makeRadioButton('#33CCCC','validity'+i,'ns', 'Not-Sure' );
   		 	var iv = makeRadioButton('#fff717','validity'+i,'iv', 'Invalid' );
   		 	var vl = makeRadioButton('#94ffb4','validity'+i,'vl', 'Valid' );
   		 	bottom.appendChild(ns);
		 	bottom.appendChild(iv);
		 	bottom.appendChild(vl);
   		 	bottom.style.width = "100%";
   		 	bottom.style.minHeight = "20px";
   		 	// bottom.style.margin = "1%";
   			bottom.style.font = "18px arial,serif";
   			// bottom.style.alignItems = "center";
   			bottom.style.alignContent = "space-between";
   			bottom.style.flexDirection = "row";
   			
    		card.appendChild(bottom);
   		 	list.appendChild(card);
   		} 
		enableBtns();
    }
    
    
    function initBatchPage(){
    	console.log('page load initialization.');
    	mode = 'batch';
    	getBatchWords();
    }
    