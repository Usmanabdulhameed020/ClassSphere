const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Class = require('../models/Class');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');

// AI Assistant Chat Endpoint
router.post('/assistant', auth, async (req, res) => {
  const { message, classId } = req.body;

  try {
    let contextStr = "";

    if (classId) {
      const cls = await Class.findById(classId);

      if (cls) {
        contextStr += `
CLASS INFORMATION
-----------------
Class Name: ${cls.name}
Section: ${cls.section || "N/A"}
Subject: ${cls.subject || "N/A"}

`;
      }

      const [materials, assignments, quizzes] = await Promise.all([
        Material.find({ classId }).limit(10),
        Assignment.find({ classId }).limit(10),
        Quiz.find({ classId }).limit(10)
      ]);

      if (materials.length) {
        contextStr += `
STUDY MATERIALS
---------------
${materials
  .map(
    (m) => `
Title: ${m.title}
Description: ${m.description || "N/A"}
Topic: ${m.topic || "N/A"}
`
  )
  .join("\n")}
`;
      }

      if (assignments.length) {
        contextStr += `
ASSIGNMENTS
-----------
${assignments
  .map(
    (a) => `
Title: ${a.title}
Instructions: ${a.instructions || "N/A"}
Points: ${a.points}
Due Date: ${
      a.dueDate
        ? new Date(a.dueDate).toLocaleDateString()
        : "N/A"
    }
`
  )
  .join("\n")}
`;
      }

      if (quizzes.length) {
        contextStr += `
QUIZZES
-------
${quizzes
  .map(
    (q) => `
Title: ${q.title}
Questions: ${q.questions?.length || 0}
Total Points: ${q.totalPoints || 0}
Due Date: ${
      q.dueDate
        ? new Date(q.dueDate).toLocaleDateString()
        : "N/A"
    }
`
  )
  .join("\n")}
`;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fixed model name to gemini-2.5-flash for compatibility with this environment
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `
You are ClassSphere AI, a professional and concise educational assistant.

PERSONALITY:
- Mature, professional, and academic.
- Direct and high-signal.
- Encouraging but succinct.

RESPONSE RULES:
1. Be concise. Avoid fluff and unnecessary introductory/concluding remarks.
2. Use professional Markdown formatting (bolding, lists) to make information digestible.
3. Only use headings if the response is long enough to require them.
4. If helping with coding, provide the solution and a brief, high-level explanation.
5. If helping with assignments, guide the student with key concepts rather than lecturing.
6. Prioritize accuracy and clarity over length.
7. Quality over quantity: a short, perfect answer is better than a long, rambling one.

CLASS CONTEXT:
${contextStr || "No classroom context available."}

USER QUESTION:
${message}
`;

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
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.statusText}`
      );
    }

    const resData = await response.json();

    let reply =
      resData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    reply = reply.trim();

    if (
      reply.startsWith('"') &&
      reply.endsWith('"')
    ) {
      reply = reply.slice(1, -1);
    }

    if (
      reply.startsWith("```") &&
      reply.endsWith("```")
    ) {
      reply = reply.replace(/```/g, "").trim();
    }

    res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error(
      "Gemini Assistant Error:",
      error
    );

    res.status(500).json({
      message: "AI Assistant Error"
    });
  }
});

// AI Quiz Generator Endpoint
router.post('/generate-quiz', auth, async (req, res) => {
  const { topic, instructions, numQuestions } = req.body;
  const count = numQuestions || 5;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `
You are an expert academic assessment tool. Generate a multiple-choice quiz about the following topic.
Topic: ${topic}
Additional Instructions: ${instructions || "None"}
Number of Questions: ${count}

You must return a valid JSON array of questions. Every question must match the following JSON schema:
{
  "question": "The text of the question?",
  "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
  "correctAnswer": 0, // The 0-based index of the correct option in the options array
  "points": 1 // Weight of the question (integer, default 1)
}

Do not include any other wrapping text, markdown formatting blocks, or explanation. Only return the JSON array of questions.
`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const resData = await response.json();
    const replyText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
    const questions = JSON.parse(replyText);

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error("AI Quiz Generator Error:", error);
    res.status(500).json({ message: "Failed to generate quiz questions via AI." });
  }
});

// AI Material Summarizer Endpoint
router.post('/summarize-material', auth, async (req, res) => {
  const { materialId } = req.body;

  try {
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `
You are an advanced academic study assistant. Analyze this study material and generate a summary, key takeaways, and flashcards for study.
Material Title: ${material.title}
Material Topic: ${material.topic || "General"}
Material Description: ${material.description || "No description provided."}

Return a valid JSON object matching the following structure:
{
  "summary": "A cohesive 1-2 paragraph study summary of the material.",
  "keyTakeaways": [
    "First main takeaway point.",
    "Second main takeaway point.",
    "Third main takeaway point."
  ],
  "flashcards": [
    {
      "question": "A concise question testing the material?",
      "answer": "The correct answer to this flashcard question."
    }
  ]
}

Ensure the flashcards have at least 3-4 high-value study cards.
Only return the JSON object. Do not include markdown codeblocks or wrapper formatting.
`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const resData = await response.json();
    const replyText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
    const summaryData = JSON.parse(replyText);

    res.json({
      success: true,
      ...summaryData
    });
  } catch (error) {
    console.error("AI Material Summarizer Error:", error);
    res.status(500).json({ message: "Failed to summarize study material." });
  }
});

module.exports = router;
