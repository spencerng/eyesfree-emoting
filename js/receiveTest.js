var trialNum;
var trialOrder;
var results = [];
var playsLeft;
var pulseVibrate = false;

function onLoad() {
	// Modify this for A/B testing
	setPulseVibrate(pulseVibrate);

	trialNum = 0;

	trialOrder = shuffle(emotes.concat(emotes))

	var nextButton = document.getElementById("nextButton")
	nextButton.onclick = function transition() {
		var startElements = document.getElementsByClassName("receiveLearn");
		changeElementVisibility(startElements, true);
		var testElements = document.getElementsByClassName("receiveTest");
		changeElementVisibility(testElements, false);

		document.onclick = function checkNextTrial(event) {
			var emoji = processEmoji(event)
			console.log(emoji)
			if (playsLeft == 2 || !emoji) {
				return;
			}

			results.push(emoji)

			if (trialNum == 11) {
				//displayResults();
				displayBuffer();
			} else {
				trialNum += 1;
				beginTrial();
			}
		}

		beginTrial();
	}

	var playButton = document.getElementById("playButton");
	playButton.onclick = function playVibration() {
		vibrate(trialOrder[trialNum], pulseVibrate);
		playsLeft -= 1;
		
		if (playsLeft == 1) {
			playButton.innerHTML = "Repeat Vibration"
		} else {
			playButton.disabled = true;
		}
	}
}

function displayBuffer(){
	document.getElementById("trial").hidden = true;
	document.getElementsByClassName('buffer')[0].style.display = "block";
}

function displayResults() {
  document.getElementsByClassName('buffer')[0].style.display = "none";
  document.getElementById("nonResultDiv").hidden = true;
  document.getElementById("trial").hidden = false;
	document.getElementById("resultDiv").hidden = false;

	var list = document.getElementById("resultsList");
	var resultsList = []
	var correct = 0;
	for (var i = 0; i < results.length; i++) {
		if (results[i] === trialOrder[i]) {
			correct += 1;
			resultsList.push("<li>" + results[i] + " correct!" + "</li>")
		} else {
			resultsList.push("<li>Expected " + trialOrder[i] + ", got " + results[i] + "</li>");
		}
		
	}
	list.innerHTML = resultsList.join("")
	document.getElementById("accuracy").innerHTML = "Accuracy: " + correct + "/12"
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function beginTrial() {
	playsLeft = 2;
	document.getElementById("trialStatus").innerHTML = "Trial " + (trialNum + 1) + "/12"
	var playButton = document.getElementById("playButton");
	playButton.disabled = false;
	playButton.innerHTML = "Play Vibration"
}

function changeElementVisibility(elems, hide) {
	for (var i = 0; i < elems.length; i++) {
		elems[i].hidden = hide
	}
}

function isTrue(val) {
	if (val) {
		return true;
	}

	return false;
}

document.onclick = function checkPressed(event) {
	sendEmojiVibrate(event);
	if (pressed.every(isTrue)) {
		document.getElementById("nextButton").disabled = false;
	}
}