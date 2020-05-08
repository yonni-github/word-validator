
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Tigrigna Word Validator</title>
    <meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1">
  	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
 	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
 	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
	<style type="text/css">
		#editable,#score{
	  		width: 100%;
	  		margin: 2%;'
	  		min-height: 40px;
	  		border-style: ridge;
	  		border-width: medium;
	  		border-radius: 10px;
			overflow: hidden;
			font-size: 25px;
			text-align: center;
	 	}
	 	
	 	.button1{
	 		width: 30%;
	 		margin: 1%;
	 	}
	 	.button2{
	 		width: 40%;
	 		margin: 2%;
	 	}
	
	</style>
    <script type="text/javascript">
    var word;
	const baseUrl = 'http://73.93.84.252/tigrigna-editor-rws/v1/';
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
    	callServer("POST",url, putValidationCallback);
    	
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
    
    </script>
</head>
<body onload="initPage()">
    <header class="container">
        <h4>Tag each word as follows:</h4>
        <h5><a href="#list" data-toggle="collapse">Click to Expand Instruction (refresh page- swipe down on freeze)</a></h5>
			<div id="list" class="collapse">
				<ul>
		  			<li><b>Valid:</b> Meaningful and correct Spelling</li>
		  			<li><b>Invalid:</b> Meaningless or incorrect Spelling</li>
		  			<li><b>Not Sure:</b> When not sure of word's validity</li>
		  			<li><b>Spell:</b> For incorrectly Spelled word or foreign term, were you want to submit a correction/translation</li>
		  			<li><b>Copy:</b> Copy word to clipboard. </li>
				</ul>
			</div>
    </header>
    <div class="container">
    	<div class="row">
			<div class="col-sm-12">
				<div>
					<a href="#content" data-toggle="collapse">Self Type Reference</a>
						<div id="content" class="collapse">
							Lorem ipsum dolor text....
						</div>
				</div>
				<form id="editor" action="" autocomplete="off">
					<div>
						<div contenteditable="false" id="editable"></div>
						<div contenteditable="false" id="score" title="Validity Score">Score</div>
						
						<div class="row">
							<div class="col-sm-8">
								<input type="button" value="Copy" class="button1 btn btn-warning btn-lg" onclick="copyEditorContent()"/>
								<input type="button" value="Spell" class="button1 btn btn-warning btn-lg disabled" onclick=""/>
								<input type="button" value="Not Sure" class="button1 btn btn-primary btn-lg " onclick="notSure()"/>
							</div>
							<div class="col-sm-4">
								<input type="button" value="Invalid" class="button2 btn btn-danger btn-lg" onclick="invalid()"/>
								<input type="button" value="Valid" class="button2 btn btn-success btn-lg" onclick="valid()"/>
							</div>
						</div>
					</div>		
    			</form>
			</div>
		</div>
    	
    </div>
        
    
</body>
</html>