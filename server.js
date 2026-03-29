const express = require('express');
const { askJarvis } = require('./ai');
const { getStats } = require('./stats');
const { listenVoice } = require('./voice');
const say = require('say');
const readline = require('readline');

const app = express();

// ASCII faces
const faces = {
  happy: "( ^_^ )",
  neutral: "( -_- )",
  angry: "( >_< )",
  talking: "( o_o )"
};

let latestData = {
  cpu: 0,
  ram: 0,
  ai: "Zencia Online",
  face: faces.neutral
};

// update stats
setInterval(async () => {
  const stats = await getStats();
  latestData.cpu = stats.cpu;
  latestData.ram = stats.ram;
}, 3000);

// API for tablet
app.get('/data', (req, res) => {
  res.json(latestData);
});

app.use(express.static('public'));

app.listen(3000, '0.0.0.0', () => {
  console.log("Zencia running on http://localhost:3000");
});


// =============================
// TERMINAL + VOICE SYSTEM
// =============================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n🤖 ZENCIA READY");
console.log("Type OR press ENTER to speak\n");

rl.on('line', async (input) => {

  if (!input.trim()) {
    console.log("\n🎤 Press ENTER and THEN speak clearly...\n");

    input = await listenVoice();

    console.log("You said:", input || "[EMPTY]");
  }

 if (
  !input ||
  input.includes("ready") ||
  input.includes("processing") ||
  input.length < 2
) {
  console.log("Didn't hear properly.\n");
  return;
}

  console.log("Zencia is thinking...");

  let response;

  try {
    const prompt = `User: ${input}\nAssistant:`;

    response = await askJarvis(prompt);

    if (!response || response.trim() === "") {
      response = "Say that again.";
    }

  } catch (err) {
    console.log("AI Error:", err);
    response = "Something went wrong.";
  }

  latestData.ai = response;

  // emotion logic
  const text = response.toLowerCase();

  if (text.includes("good") || text.includes("great")) {
    latestData.face = faces.happy;
  } else if (text.includes("warning") || text.includes("late")) {
    latestData.face = faces.angry;
  } else {
    latestData.face = faces.neutral;
  }

  // speak
  setTimeout(() => say.speak(response), 100);

  console.log("\nZencia:", response, "\n");
});