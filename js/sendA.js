  var msg;

  function displayTest() {
      var info = document.getElementById("testInfo");
      var test = document.getElementById("testDisplay");
      info.style.display = "none";
      test.style.display = "block";

      onLoadEvent();
      msg = new SpeechSynthesisUtterance();
      msg.text = emojiTest[testIndex];
      window.speechSynthesis.speak(msg);
      startTest();
  }


  $(document).ready(function() {
      myVar = setInterval("statusRefresh2()", 10);
  });

  function statusRefresh2() {
      var x = document.getElementById("tocopy").textContent;
      if (x != "no emoticon detected") {
          nextEmoticon();
      }
  }

  function statusRefresh() {
      var x = document.getElementById("tocopy").textContent;
      var display = "";
      if (x != "no emoticon detected") {
          display = "emoticon detected";
      } else {
          display = "no emoticon detected";
      }
      document.getElementById("testCopy").innerHTML = display;
  }

  var testIndex = 0;
  var emoticonIndex = 0;
  var emoticonsInfo = [];
  var emoticons = ['yay', 'love', 'laugh', 'like', 'sad', 'angry'];
  var emojiTest = ['laugh', 'sad', 'love', 'yay', 'angry', 'like'];
  var testResults = [];

  for (var i = 0; i < 6; i++) {
      emoticonsInfo.push({
          trace: "../assets/trace_" + emoticons[i] + ".png",
          emoji: "../assets/" + emoticons[i] + ".png"
      })
  }

  var testCase = document.getElementsByClassName("testing")[0];
  var traceReplace = document.getElementsByClassName("trace")[0];
  var emojiReplace = document.getElementsByClassName("emoji")[0];
  var nameText = document.getElementsByClassName("emoji_name")[0];
  var results = document.getElementsByClassName("results")[0];

  function onloading() {
      onLoadEvent();
      startTest();
  }

  function startTest() {
      nameText.innerHTML = (testIndex + 1) + '. ' + emojiTest[testIndex];
      startEmote();
  }

  function getTests() {
      for (var i = 0; i < 6; i++) {
          var rand = Math.floor(Math.random() * 6);
          emojiTest.push(emoticons[rand]);
      }
      testCase.innerHTML = emojiTest.toString();
  }

  function locEmoticon(emote) {
      for (var i = 0; i < 6; i++) {
          if (emoticons[i] == emote) {
              return i;
          }
      }
      return -1;
  }

  function startEmote() {
      onClickClearStrokes();
      testIndex = (testIndex) % 6;

      var ind = locEmoticon(emojiTest[testIndex])

      traceReplace.src = emoticonsInfo[ind].trace;
      emojiReplace.src = emoticonsInfo[ind].emoji;
      nameText.innerHTML = (testIndex + 1) + '. ' + emojiTest[testIndex];

  }

  function copyEmotion() {
      var x = document.getElementById("tocopy").textContent;
      document.getElementById("copy").innerHTML = x;
  }

  function nextEmoticon() {
      var x = document.getElementById("tocopy").textContent;
      testResults.push(x)
      document.getElementById("results").innerHTML = testResults;

      onClickClearStrokes();
      testIndex = (testIndex + 1);

      if (testIndex == 6) {
          displayBuffer();
          sendPulseSequence(800, 1);
          return;
      }

      sendPulseSequence(100, 1);

      var ind = locEmoticon(emojiTest[testIndex])

      traceReplace.src = emoticonsInfo[ind].trace;
      emojiReplace.src = emoticonsInfo[ind].emoji;
      nameText.innerHTML = (testIndex + 1) + '. ' + emojiTest[testIndex];

      msg.text = emojiTest[testIndex];
      window.speechSynthesis.speak(msg);
  }

  function trimResults() {
      trimmed = [];
      for (var i = 0; i < 6; i++) {
          if (testResults[i] == "no emoticon detected") {
              trimmed.push("no emoticon detected");
          } else {
              trimmed.push(testResults[i].split(" ")[0]);
          }
      }
      return trimmed;
  }

  function calcAccuracy() {
      var score = 0;
      var results = trimResults()
      for (var i = 0; i < 6; i++) {
          if (results[i] == emojiTest[i]) {
              score += 1;
          }
      }
      return score.toString() + "/6";
  }

  function completeTest() {
      window.alert("Thank you for taking our test!\nYour Test Accuracy is: " + calcAccuracy());
  }

  function goToTest() {
      window.alert("By clicking OK, you confirm that you have learned this method of sending emoticons and are ready to use them in a study trial.")
  }

  function displayBuffer() {
      document.getElementsByClassName('outer')[0].style.display = "none";
      document.getElementsByClassName('buffer')[0].style.display = "block";
  }

  function displayResults() {
      document.getElementsByClassName('buffer')[0].style.display = "none";
      document.getElementsByClassName('outer')[0].style.display = "none";
      document.getElementsByClassName('resultDiv')[0].style.display = "block";

      document.getElementById("accuracy").innerHTML = "Accuracy: " + calcAccuracy();

      var resultsList = []
      var list = document.getElementById("resultsList");
      resultsList.push("<div class='trial_result'><span><b>Expected<\/b><\/span><span><b>Got<\/b><\/span><\/div>")
      for (var i = 0; i < trimResults().length; i++) {
          if (trimResults()[i] === emojiTest[i]) {
              resultsList.push("<div class='trial_result'><span>" + trimResults()[i] + "<\/span><span class='correct'>&#x2714<\/span><\/div>")
          } else {
              resultsList.push("<div class='trial_result'><span>" + emojiTest[i] + "<\/span><span class='wrong'>" + trimResults()[i] + "<\/span><\/div>")
          }
      }
      list.innerHTML = resultsList.join("");
  }