
//
// Startup
//
var _isDown, _points, _strokeID, _r, _g, _rc; // global variables
function onLoadEvent()
{
  _points = new Array(); // point array for current stroke
  _strokeID = 0;
  _r = new DollarRecognizer();

  var canvas = document.getElementById('myCanvas');
  _g = canvas.getContext('2d');
  _g.lineWidth = 3;
  _g.font = "16px Gentilis";
  _rc = getCanvasRect(canvas); // canvas rect on page
  

  _isDown = false;
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
    var clr = "rgb(" + rand(0,200) + "," + rand(0,200) + "," + rand(0,200) + ")";
    _g.strokeStyle = clr;
    _g.fillStyle = clr;
    _g.fillRect(x - 4, y - 3, 9, 9);
  }

}
function mouseMoveEvent(x, y, button)
{
  if (_isDown)
  {
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
    pointStr += "),"
  }
  pointStr = pointStr.slice(0, -1) + ")"
  console.log(pointStr)
}
function mouseUpEvent(x, y, button)
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
function drawText(str)
{
  _g.fillStyle = "rgb(255,255,136)";
  _g.fillRect(0, 0, _rc.width, 20);
  _g.fillStyle = "rgb(0,0,255)";
  _g.fillText(str, 1, 14);
}
function rand(low, high)
{
  return Math.floor((high - low + 1) * Math.random()) + low;
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
}
