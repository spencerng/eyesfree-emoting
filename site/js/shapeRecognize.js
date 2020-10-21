$(document).ready(function(){
  window.Canvas.init()

  var recognizer = new DollarRecognizer();

  var strokes = [];
  var stroking = []

  var render = function(){
    window.Canvas.clear()
    console.log("Rendering")
    _.each(strokes, function(strk){
      window.Canvas.path(strk, 3, "#777777");
    })

    window.Canvas.path(stroking, 3, "#000000");

    if( !drawing && strokes.length){
      var _strokes = strokes.map(function(stroke){
                                      return stroke.map(function(p){
                                        return new nDollar.Point(p.x, p.y);
                                      })
                                });

      var useBoundedRotationInvariance = $("input[name=boundRotation]").is(':checked');
      var requireSameNoOfStrokes = $("input[name=sameStrokeCount]").is(':checked');
      var useProtractor = $("input[name=alghorithm]:checked").val() == 'protactor';

      var result = recognizer.Recognize( _strokes, useBoundedRotationInvariance, requireSameNoOfStrokes, useProtractor);
      console.log(result);
      var text = "Gesture result: " + result.Name + ", score: "+ result.Score+" points\n<H1>";
      $("#output").html(text);
    }


  }

  var drawing = false;




  $("canvas:first")
  .mousedown(function(e){
      drawing = true;
      stroking.push({x:e.offsetX, y:e.offsetY})
      render();
  })
  .mousemove(function(e){
     if(drawing){
      stroking.push({x:e.offsetX, y:e.offsetY})
      render();
    }
  })
  .mouseup(function(e){
    if(drawing){
      drawing = false;
      stroking.push({x:e.offsetX, y:e.offsetY})
      strokes.push(stroking);
      stroking = [];
      render();
    }
  });

});


window.Canvas = new (function(){


  var canvas;
  this.init = function(){
    canvas = document.getElementsByTagName("canvas")[0];
    this.context = canvas.getContext("2d");
  }

  this.clear = function(){
      this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  this.text = function(txt, p, color, offset=0){
    this.context.fillStyle = color || '#000000';
    this.context.fillText(txt,p.x+offset,p.y+offset);
  }

  this.point = function(p, r, color, name, offset){
    offset = offset || {x:0, y:0};
    this.context.fillStyle = color || '#000000';
    this.context.beginPath();
    this.context.arc(p.x + offset.x, p.y + offset.y, r || 3, 0, 2 * Math.PI, false);
    this.context.fill();
    name && name.length && this.text(name, p, color, r + offset.y);
  }

  this.circle = function(p, r, color, name){
    this.context.strokeStyle = color || '#000000';
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.arc(p.x, p.y, r || 3, 0, 2 * Math.PI, false);
    this.context.stroke();
    name && name.length && this.text(name, p, color, r);
  }

  this.rect = function(bound, w, color, name){
    this.context.strokeStyle = color || '#000000';
    this.context.lineWidth = w;
    this.context.rect(bound.left, bound.top, bound.right-bound.left, bound.bottom-bound.top);
    this.context.stroke();
    name && name.length && this.text(name, {x:bound.right, y:bound.bottom}, color, w+1);
  }

  this.line = function(p1, p2, thickness, color, name, offset){
    offset = offset || {x:0, y:0};
    this.context.strokeStyle = color || '#000000';
    this.context.lineWidth = thickness;
    this.context.beginPath();
    this.context.moveTo(p1.x + offset.x, p1.y + offset.y);
    this.context.lineTo(p2.x + offset.x, p2.y + offset.y);
    this.context.stroke();
    name && name.length && this.text(name, {x:(p1.x+p2.x+ offset.x)/2 + 5, y:(p1.y+p2.y+ offset.x)/2 + 10}, color);
  }

  var getColor = function(c, i){
    if(typeof c=='object' && length in c)
      return c[i%c.length]

    return c;
  }

  this.path = function(points, thickness, color, name){
    var prev = points[0];
    //console.log(points)
    for(var i=1;i<points.length;i++){
      var p = points[i];
      this.context.strokeStyle = getColor(color, i);
      this.context.lineWidth = thickness;
      this.context.beginPath();
      this.context.moveTo(prev.x, prev.y);
      this.context.lineTo(p.x, p.y);
      this.context.stroke();
      prev = p;
    }
    name && name.length && this.text(name, points[points.length-1], getColor(color, 0));
  }

})();