var performAutodetect;

//
// Startup
//
var _isDown, _points, _strokeID, _r, _g, _rc; // global variables
function onLoadEvent()
{
  _points = new Array(); // point array for current stroke
  _strokeID = 0;
  _r = new PDollarPlusRecognizer();

  var canvas = document.getElementById('myCanvas');
  canvas.width = document.body.scrollWidth * 0.9
  canvas.height = document.body.scrollHeight * 0.75
  canvas.addEventListener("touchstart", touchStartEvent, false);
  canvas.addEventListener("touchmove", touchMoveEvent, false);
  canvas.addEventListener("touchend", touchEndEvent, false);

  _g = canvas.getContext('2d');
  _g.lineWidth = 3;
  _g.font = "16px Gentilis";
  _rc = getCanvasRect(canvas); // canvas rect on page
  

  _isDown = false;
}

function touchStartEvent(event) {
   mouseDownEvent(event.touches[0].pageX, event.touches[0].pageY, 0)
}

function touchMoveEvent(event) {
  mouseMoveEvent(event.touches[0].pageX, event.touches[0].pageY, 0);
  event.preventDefault();
}

function touchEndEvent(event) {
  mouseUpEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY, 0);
}

function getCanvasRect(canvas)
{
  var w = canvas.width;
  var h = canvas.height;

  var cx = canvas.offsetLeft;
  var cy = canvas.offsetTop;
  while (canvas.offsetParent != null)
  {
    canvas = canvas.offsetParent;
    cx += canvas.offsetLeft;
    cy += canvas.offsetTop;
  }
  return {x: cx, y: cy, width: w, height: h};
}
function getScrollX()
{
  var scrollX = $(window).scrollLeft();
  return scrollX;
}
function getScrollY()
{
  var scrollY = $(window).scrollTop();
  return scrollY;
}
//
// Mouse Events
//
function mouseDownEvent(x, y, button)
{
  clearTimeout(performAutodetect);
  document.onselectstart = function() { return false; } // disable drag-select
  document.onmousedown = function() { return false; } // disable drag-select
  if (button <= 1)
  {
    _isDown = true;
    x -= _rc.x - getScrollX();
    y -= _rc.y - getScrollY();
    if (_strokeID == 0) // starting a new gesture
    {
      _points.length = 0;
      _g.clearRect(0, 0, _rc.width, _rc.height);
    }
    _points[_points.length] = new Point(x, y, ++_strokeID);
    
  }

}
function mouseMoveEvent(x, y, button)
{

  if (_isDown)
  {
    clearTimeout(performAutodetect);
    x -= _rc.x - getScrollX();
    y -= _rc.y - getScrollY();
    _points[_points.length] = new Point(x, y, _strokeID); // append
    drawConnectedPoint(_points.length - 2, _points.length - 1);
  }
}
function printPoints() {
  var pointStr = "new Array("
  for (var i = 0; i < _points.length; i++) {
    pointStr += "new Point(" + _points[i].X
    pointStr += "," + _points[i].Y
	pointStr += "," + _points[i].ID
    pointStr += "),"
  }
  pointStr = pointStr.slice(0, -1) + ")"
  console.log(pointStr)
}
async function mouseUpEvent(x, y, button)
{
  printPoints()
  document.onselectstart = function() { return true; } // enable drag-select
  document.onmousedown = function() { return true; } // enable drag-select
  if (button <= 1)
  {
    if (_isDown)
    {
      _isDown = false;
    }
  }

  performAutodetect = setTimeout(function() {
    detectEmoticon();
  }, 1000)

}

function detectEmoticon() {
  var statusText = document.getElementsByClassName("status")[0]
  if (_points.length >= 10)
    {
      var result = _r.Recognize(_points);
      statusText.innerHTML = result.Name + " detected (" + round(result.Score,2) + ")";
    }
    else
    {
      statusText.innerHTML = "no emoticon detected"
    }
    _strokeID = 0; // signal to begin new gesture on next mouse-down
}

function drawConnectedPoint(from, to)
{
  _g.beginPath();
  _g.moveTo(_points[from].X, _points[from].Y);
  _g.lineTo(_points[to].X, _points[to].Y);
  _g.closePath();
  _g.stroke();
}

function round(n, d) // round 'n' to 'd' decimals
{
  d = Math.pow(10, d);
  return Math.round(n * d) / d;
}

function onClickClearStrokes()
{
  _points.length = 0;
  _strokeID = 0;
  _g.clearRect(0, 0, _rc.width, _rc.height);
  
  var statusText = document.getElementsByClassName("status")[0]
  statusText.innerHTML = 'no emoticon detected'
}
