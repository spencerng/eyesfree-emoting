var lastTouched = undefined;

var emojis = ["yay", "sad", "angry", "laugh", "love", "like"]
var showWheel;

$.fn.extend({
    disableSelection: function() {
        this.each(function() {
            this.onselectstart = function() {
                return false;
            };
            this.unselectable = "on";
            $(this).css('-moz-user-select', 'none');
            $(this).css('-webkit-user-select', 'none');
        });
        return this;
    }
});

function onLoadEvent()
{
  var canvas = document.getElementById('myCanvas');
  
  document.onmousedown = mouseDown
  document.onmouseup = mouseUp

  $(document).ready(function(){

     $('.notSelectable').disableSelection();

  });

  canvas.addEventListener("touchstart", touchStartEvent, false);
  canvas.addEventListener("touchmove", touchMoveEvent, false);
  canvas.addEventListener("touchend", touchEndEvent, false);
  canvas.width = document.body.scrollWidth * 0.9
  canvas.height = document.body.scrollHeight * 0.75
  
  let items = document.getElementsByClassName("item")

  for (var i = 0; i < items.length; i++) {
    items[i].onmouseover = function haptic() {
      vibrateFreq(0.02, 75);
      console.log("mouseover")
    }
  }

}
function mouseUp(event) {
  clearTimeout(showWheel)
  var wheelSel = document.getElementById("wheel");
  wheelSel.style.display = 'none';

  if (emojis.includes(lastTouched)) {
    updateEmoji(lastTouched);
    lastTouched = undefined;
  } else if (emojis.includes(event.target.id)) {
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
  navigator.vibrate(pattern);
}
function mouseDown(event) {
  showWheel = setTimeout(function() {
    vibrateFreq(0.075, 20);
    var wheelSel = document.getElementById("wheel");
    wheelSel.style.display = 'block';
    var x = event.pageX;
    var y = event.pageY;
    
    var width = wheelSel.scrollWidth;
    var height = wheelSel.scrollHeight;

    wheelSel.style.display = 'block';
    wheelSel.style.position = 'absolute';
    wheelSel.style.left = x - width/2 + 'px'
    wheelSel.style.top = y - height/2 + 'px'
  }, 250)
  
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

function touchMoveEvent(event) {
  var touch = event.touches[0]
  var elem = document.elementFromPoint(touch.clientX, touch.clientY)

  if (!(elem.id === lastTouched) && emojis.includes(elem.id)) {
    vibrateFreq(0.1, 75);
  }

  lastTouched = elem.id;
}