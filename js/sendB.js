var msg, testIndex, emoticonIndex, emoticonsInfo, emojiTest, testResults, testCase, emojiReplace, nameText, results;

function displayTest() {
    var info = document.getElementById("testInfo");
    var test = document.getElementById("testDisplay");
    info.style.display = "none";
    test.style.display = "block";


    onLoadEvent();
    testIndex = 0;
    emoticonIndex = 0;
    emoticonsInfo = [];
    emoticons = ['yay', 'love', 'laugh', 'like', 'sad', 'angry'];
    emojiTest = ['laugh', 'sad', 'love', 'yay', 'angry', 'like'];
    testResults = [];

    for (var i = 0; i < 6; i++) {
        emoticonsInfo.push({
            trace: "../assets/trace_" + emoticons[i] + ".png",
            emoji: "../assets/" + emoticons[i] + ".png"
        })
    }

    testCase = document.getElementsByClassName("testing")[0];

    emojiReplace = document.getElementsByClassName("emoji")[0];
    nameText = document.getElementsByClassName("emoji_name")[0];
    console.log(nameText)
    results = document.getElementsByClassName("results")[0];
    msg = new SpeechSynthesisUtterance();
    msg.text = emojiTest[testIndex];
    window.speechSynthesis.speak(msg);


    startTest();
}

$(document).ready(function() {
    myVar = setInterval("statusRefresh2()", 10);
});

function statusRefresh2() {
    var x = document.getElementById("update").textContent;
    document.getElementById("testCopy").innerHTML = x;
    if (x != "None") {

        nextEmoticon();
        document.getElementById("update").innerHTML = "None";
    }
}

function startTest() {

    nameText.innerHTML = (testIndex + 1) + '. ' + emojiTest[testIndex];
    console.log(nameText.innerHTML)
    startEmote();
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
    testIndex = (testIndex) % 6;

    var ind = locEmoticon(emojiTest[testIndex])


    console.log("Next emoji: ", emoticonsInfo[ind].emoji);


    emojiReplace.src = emoticonsInfo[ind].emoji;
    nameText.innerHTML = (testIndex + 1) + '. ' + emojiTest[testIndex];

    msg.text = emojiTest[testIndex];


}

function copyEmotion() {
    var x = document.getElementById("tocopy").textContent;
    document.getElementById("copy").innerHTML = x;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function nextEmoticon() {
    var x = document.getElementById("update").textContent;
    testResults.push(x)
    testIndex = (testIndex + 1);

    await sleep(250);

    if (testIndex == 6) {
        sendPulseSequence(800, 1);
        displayBuffer();
        return;
    }
    sendPulseSequence(100, 1);
    var ind = locEmoticon(emojiTest[testIndex])



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