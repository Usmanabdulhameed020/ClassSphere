require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const model = 'gemini-2.5-flash';
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

async function testGeneration() {
  console.log('Testing Gemini Generation...');
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Explain photosynthesis in 2 sentences."
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Success!');
      console.log('Reply:', data.candidates[0].content.parts[0].text);
    } else {
      console.error('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testGeneration();
