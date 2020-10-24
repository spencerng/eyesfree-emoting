var pressed = [false, false, false, false, false, false]
var emotes = ["love", "yay", "laugh", "like", "sad", "angry"]

function sendPulseSequence(duration, count) {
	var pattern = [];
	for (var i = 0; i < count; i++) {
		// This is vibration length
		pattern.push(duration)

		// This is the pause duration
		pattern.push(duration * 1.25)
	}
	console.log(pattern)
	navigator.vibrate(pattern)
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

function composeVibrate(timesArr) {
	var pattern = [];
	// This takes in an array with elements [duration, delay, frequency]
	for (var i = 0; i < timesArr.length; i++) {
		pattern = pattern.concat(vibrateFreq(timesArr[i][0], timesArr[i][2]))
		pattern[pattern.length - 1] += timesArr[i][1] * 1000
	}
	console.log(pattern)
	navigator.vibrate(pattern)
}

function vibrate(emote, isPulse) {
	if (isPulse) {
		let mapping = {
			"love": [100, 1],
			"yay": [100, 2],
			"laugh": [100, 3],
			"like": [300, 1],
			"sad": [300, 2],
			"angry": [300, 3]
		};
		sendPulseSequence(mapping[emote][0], mapping[emote][1])
	} else {
		let mapping = {
			"love": [[0.1, 0.05, 12], [0.1, 0.325, 12], [0.1, 0.05, 12], [0.1, 0, 12]], //:-O
			"yay": [[0.8, 0, 40]], // :)
			"laugh": [[0.4, 0.45, 111], [0.35, 0, 20]], // :D
			"like": [[0.1, 0, 12]],
			"sad": [[0.4, 0.25, 90], [0.5, 0, 111]], // :((
			"angry": [[0.2, 0.27, 25], [0.6, 0, 12]]// X-C
		};
		composeVibrate(mapping[emote])
	}
}

var manualVibrateSet = false;
var pulseVibrate = false;

function setPulseVibrate(val) {
	manualVibrateSet = true;
	pulseVibrate = val;
};

function processEmoji(e) {
	var clickedImg = e.target.src
	if (!clickedImg) {
		return undefined;
	}

	for (var i = 0; i < emotes.length; i++) {
		if (clickedImg.includes(emotes[i])) {
			pressed[i] = true;
			return emotes[i]
			
			break;
		}
	}
}

function sendEmojiVibrate(e) {
	var emoji = processEmoji(e);
	
	if (!emoji) {
		return;
	}
	

	var statusText = document.getElementsByClassName("status")[0]
	
	var radios = document.getElementsByName("vibrateType")
	var isPulse = (manualVibrateSet && pulseVibrate) || (radios.length != 0 && radios[0].checked)

	var pressed = vibrate(emoji, isPulse)
	statusText.innerHTML = emoji + " pressed";
	

}

//Need func to create duration, delay, and freqency
document.onclick = sendEmojiVibrate
