
require('dotenv').config();

async function summarizer(content) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.API}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemma-4-26b-a4b-it:free",
          messages: [
            {
              role: "user",
              content: `Summarize this news in simple language in 60-80 words maximum:\n\n${content}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `OpenRouter API Error (${response.status}): ${
          data.error?.message || JSON.stringify(data)
        }`
      );
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("AI did not return a summary.");
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("Summarizer failed:", error.message);
    throw error;
  }
}

module.exports = { summarizer };
