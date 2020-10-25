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

function onLoadEvent() {
    var dpi = getDPI();
    var canvas = document.getElementById('myCanvas');

    document.onmousedown = mouseDown
    document.onmouseup = mouseUp


    canvas.addEventListener("touchstart", touchStartEvent, false);
    canvas.addEventListener("touchmove", touchMoveEvent, false);
    canvas.addEventListener("touchend", touchEndEvent, false);
    canvas.width = document.body.scrollWidth * 0.9
    canvas.height = document.body.scrollHeight * 0.75


    var wheel = document.getElementById("wheel")
    wheel.style.height = dpi * 2 + "px"
    wheel.style.width = dpi * 2 + "px"

    let items = document.getElementsByClassName("item")


    for (var i = 0; i < items.length; i++) {
        items[i].childNodes[0].style.height = dpi * 0.4666 + "px"
        items[i].childNodes[0].style.width = dpi * 0.4666 + "px"
        items[i].style.transform = "rotate(" + (1 / 12 + 1 / 6 * i) + "turn) "
        items[i].style.transform += "translate(" + (-dpi * 0.68666) + "px) "
        items[i].style.transform += "rotate(-" + (1 / 12 + 1 / 6 * i) + "turn) "

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
        wheelSel.style.left = x - width / 2 + 'px'
        wheelSel.style.top = y - height / 2 + 'px'
    }, 250)

}

function getDPI() {
    document.body.innerHTML = "<div id=\"dpi\" style=\"height: 1in; width: 1in; left: 100%; position: fixed; top: 100%;\"></div>" + document.body.innerHTML
    var dpi_x = document.getElementById('dpi').offsetWidth;
    var dpi_y = document.getElementById('dpi').offsetHeight;
    var width = screen.width / dpi_x;
    var height = screen.height / dpi_y;
    console.log(dpi_x, dpi_y)
    return dpi_x
}

function updateEmoji(em) {
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