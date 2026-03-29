const { spawn } = require('child_process');

function listenVoice() {
  return new Promise((resolve) => {

    console.log("🎤 Opening voice input...");

    // 🔥 Open Python in interactive mode (THIS FIXES IT)
    const py = spawn('python', ['voice.py'], {
      stdio: ['inherit', 'pipe', 'inherit']
    });

    let output = '';

    py.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);

      output += text;
    });

    py.on('close', () => {
      const lines = output.split(/\r?\n/);

      // 🔥 get last meaningful line
      const spoken = lines.reverse().find(l =>
        l.trim() &&
        !l.includes("Ready") &&
        !l.includes("Processing")
      );

      resolve((spoken || "").toLowerCase());
    });

  });
}

module.exports = { listenVoice };