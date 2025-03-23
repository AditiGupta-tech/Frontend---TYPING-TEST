// Fetch a random paragraph from an API
async function generateNewSentence() {
    try {
        const response = await fetch("https://baconipsum.com/api/?type=all-meat&paras=1&sentences=5&format=text");
        const paragraph = await response.text();
        document.getElementById("quote").textContent = paragraph; // Update UI with new sentence
        resetTest(); // Reset typing test
    } catch (error) {
        console.error("Error fetching sentence:", error);
        document.getElementById("quote").textContent = "Failed to load sentence. Try again.";
    }
}

// Variables for typing test
let startTime, endTime;
const inputBox = document.getElementById("input-box");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timeDisplay = document.getElementById("time");

// Start the timer when the user starts typing
inputBox.addEventListener("input", function () {
    if (!startTime) {
        startTime = new Date().getTime();
    }
});

// Function to calculate WPM, accuracy, and time
function calculateResults() {
    if (!startTime) return;

    endTime = new Date().getTime();
    let totalTime = ((endTime - startTime) / 1000).toFixed(2); // Convert milliseconds to seconds

    let typedText = inputBox.value.trim();
    let originalText = document.getElementById("quote").textContent.trim();
    let wordsTyped = typedText.split(/\s+/).length;
    let wordsOriginal = originalText.split(/\s+/);

    // Calculate accuracy
    let correctWords = 0;
    typedText.split(/\s+/).forEach((word, index) => {
        if (word === wordsOriginal[index]) correctWords++;
    });
    let accuracy = ((correctWords / wordsOriginal.length) * 100).toFixed(2);

    let wpm = Math.round((wordsTyped / totalTime) * 60);

    // Update UI with results
    wpmDisplay.textContent = isNaN(wpm) ? 0 : wpm;
    accuracyDisplay.textContent = isNaN(accuracy) ? 100 : accuracy;
    timeDisplay.textContent = totalTime;
}

// Reset the test
function resetTest() {
    inputBox.value = "";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    timeDisplay.textContent = "0";
    startTime = null;
}

// Event Listener for Restart Button
document.getElementById("restart-btn").addEventListener("click", generateNewSentence);

// Calculate results when typing stops
inputBox.addEventListener("keyup", function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(calculateResults, 1000); // Calculate after 1 second of inactivity
});

// Generate first sentence on page load
generateNewSentence();