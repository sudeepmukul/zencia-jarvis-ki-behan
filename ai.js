const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function askJarvis(prompt) {
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3:mini',   // ✅ IMPORTANT CHANGE
        prompt: prompt,
        stream: false,
        options: {
          num_predict: 60,     // good length
          temperature: 0.6     // stable replies
        }
      })
    });

    const data = await res.json();

    console.log("RAW:", data); // keep for debugging

    if (!data || !data.response) return null;

    return data.response.trim();

  } catch (err) {
    console.log("FETCH ERROR:", err);
    return null;
  }
}

module.exports = { askJarvis };