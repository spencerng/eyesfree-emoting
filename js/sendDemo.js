var shapeTrace = false;
var traceReplace;
var emojiReplace;
var nameText;

var emoticonIndex = 0;
var emoticonsInfo = [];
var emoticons = ['yay', 'love', 'laugh', 'like', 'sad', 'angry'];


for (var i = 0; i < 6; i++) {
  emoticonsInfo.push({
    trace: "../assets/trace_" + emoticons[i] + ".png",
    emoji: "../assets/" + emoticons[i] + ".png"
  })
}

function displayDemo() {
    var info = document.getElementById("info");
    var demo = document.getElementById("demoDisplay");
    info.style.display = "none";
    demo.style.display = "block";
    if (shapeTrace) {
      traceReplace = document.getElementsByClassName("trace")[0];
    }
    emojiReplace = document.getElementsByClassName("emoji")[0];
    nameText = document.getElementsByClassName("emoji_name")[0];
    onLoadEvent();
}

function updateGraphics(index) {
  if (shapeTrace) {
    traceReplace.src = emoticonsInfo[index].trace;
  }
  emojiReplace.src = emoticonsInfo[index].emoji;
  nameText.innerHTML = (index + 1) + '. ' + emoticons[index];
}

function nextEmoticon() {
  if (shapeTrace) {
    onClickClearStrokes(); 
  }
  emoticonIndex = (emoticonIndex + 1) % 6;
  updateGraphics(emoticonIndex);
}

function prevEmoticon() {
  if (shapeTrace) {
    onClickClearStrokes(); 
  }
  emoticonIndex = (emoticonIndex + 5) % 6;
  updateGraphics(emoticonIndex);
}