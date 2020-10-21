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

document.onclick = function sendEmojiPulse(e) {
	var type = e.target.src
	let mapping = {
		"love": [100, 1],
		"yay": [100, 2],
		"laugh": [100, 3],
		"like": [300, 1],
		"sad": [300, 2],
		"angry": [300, 3]
	};
	var statusText = document.getElementsByClassName("status")[0]
	
	for (let emote in mapping) {
		if (type.includes(emote)) {
			sendPulseSequence(mapping[emote][0], mapping[emote][1])
			statusText.innerHTML = emote + " pressed";
			break;
		}
	}
}