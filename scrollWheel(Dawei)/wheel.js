var emoji = "None"

function ab1_Click() {
   var vid1 = document.getElementById("wheel");
   if (vid1.style.visibility == "visible") { v = "hidden"; }
   else{
	   v = "visible"
   }
   vid1.style.visibility =  v; 
} 

function mouseDown() {
	document.getElementById("wheel").style.display = 'block';
}

function mouseUp() {
  document.getElementById("wheel").style.display = 'none';
}


function foo() {
	document.getElementById("wheel").style.display = "none";
}

function myFunction() {
  var x = document.getElementById("wheel");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function userClicked() {
    var x = event.clientX;
    var y = event.clientY;
    var wheelSel = document.getElementById("wheel");
    wheelSel.style.display = 'block';
    wheelSel.style.position = 'center';
}

function myFunction1() {
  document.getElementById("demo").innerHTML = emoji;
}

function updateEmoji(em){
	document.getElementById("update").innerHTML = em;
}