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

//Need func to create duration, delay, and freqency
document.onclick = function sendEmojiPulse(e) {
	var type = e.target.src
	let mapping = {
		"love": [[0.1, 0.05, 12], [0.1, 0.2, 12], [0.1, 0.05, 12], [0.1, 0, 12]], //:-O
		"yay": [[0.6, 0, 111]], // :)
		"laugh": [[0.4, 0.45, 111], [0.35, 0, 12]], // :D
		"like": [[0.1, 0, 12]],
		"sad": [[0.9, 0.25, 12], [0.4, 0, 111]], // :((
		"angry": [[0.2, 0.27, 111], [0.6, 0, 12]]// X-C
	};
	var statusText = document.getElementsByClassName("status")[0]
	
	for (let emote in mapping) {
		if (type.includes(emote)) {
			composeVibrate(mapping[emote])
			statusText.innerHTML = emote + " pressed";
			break;
		}
	}
}