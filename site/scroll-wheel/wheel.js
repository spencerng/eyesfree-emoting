var emoji = "None"

function onLoadEvent()
{
  var canvas = document.getElementById('myCanvas');
  
  document.onmousedown = mouseDown

  document.onmouseup = mouseUp

  canvas.addEventListener("touchstart", touchStartEvent, false);
//  canvas.addEventListener("touchmove", touchMoveEvent, false);
  canvas.addEventListener("touchend", touchEndEvent, false);

  let items = document.getElementsByClassName("item")

  for (var i = 0; i < items.length; i++) {
    items[i].onmouseover = function haptic() {
      vibrateFreq(0.1, 75);
      console.log("mouseover")
    }
  }
}
function mouseUp(event) {
  var wheelSel = document.getElementById("wheel");
  wheelSel.style.display = 'none';

  var emojis = ["yay", "sad", "angry", "laugh", "love", "like"]
  if (emojis.includes(event.target.id)) {
    updateEmoji(event.target.id);  
  }
  
}
function vibrateFreq(duration, freq) {
  var pattern = [];
  var halfCycle = (1 / freq) / 2;
  var cycles = Math.ceil(duration * freq)
  for (var i = 0; i < cycles * 2; i++) {
    // We multiply by 1k for milliseconds
    pattern.push(halfCycle * 1000)
  }
  return pattern
}
function mouseDown(event) {
    var wheelSel = document.getElementById("wheel");
    wheelSel.style.display = 'block';
    var x = event.pageX;
    var y = event.pageY;
    console.log(x,y)
    
    var width = wheelSel.scrollWidth;
    var height = wheelSel.scrollHeight;
    console.log(width, height)

    wheelSel.style.display = 'block';
    wheelSel.style.position = 'absolute';
    wheelSel.style.left = x - width/2 + 'px'
    wheelSel.style.top = y - height/2 + 'px'
  }

function updateEmoji(em){
  document.getElementById("update").innerHTML = em;
}

function touchStartEvent(event) {
    mouseDown(event.touches[0]) 
}

function touchEndEvent(event) {
  console.log(event.changedTouches[0])
    mouseUp(event.changedTouches[0])
}