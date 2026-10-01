const Groq = require('groq-sdk');

// Category focus topics for prompt targeting
const CATEGORY_TOPICS = {
  'Wet / Organic Waste': 'Wet and Organic Waste segregation, composting, kitchen food scraps, vegetable pulp, bio-degradable waste disposal, green bin practices.',
  'Segregation': 'Wet vs Dry waste segregation rules, organic food waste composting, paper/plastic sorting, proper color-coded civic bin usage.',
  'Dry / Recyclable Waste': 'Dry and Recyclable waste segregation, plastic identification codes (PET/HDPE), paper, cardboard, glass, tin cans, blue bin recycling practices.',
  'Recycling': 'Dry and Recyclable waste segregation, plastic identification codes (PET/HDPE), paper, cardboard, glass, tin cans, blue bin recycling practices.',
  'E-Waste & Electronics': 'Electronic waste disposal, circuit boards, discarded lithium batteries, old monitors, cables, toxic heavy metal hazards in e-waste.',
  'Hazardous Waste': 'Household hazardous waste, chemical cleaning agents, fluorescent tubes, medical/pharmaceutical packaging, paint, red bin safety procedures.'
};

/**
 * Generate structured quiz questions using Groq API
 * @param {string} category - Waste topic category
 * @param {number} numQuestions - Number of questions (default 3)
 * @returns {Promise<Array>} Array of structured question objects
 */
const generateQuizQuestions = async (category = 'Segregation', numQuestions = 3) => {
  const topicFocus = CATEGORY_TOPICS[category] || CATEGORY_TOPICS['Segregation'];

  const promptText = `You are an expert civic environmental educator for WasteSphere. Generate a high-quality civic awareness quiz.

CRITICAL FORMATTING INSTRUCTIONS:
1. Return ONLY a valid JSON object. Do not include markdown codeblocks or extra text.
2. The JSON object must strictly match this structure:
{
  "questions": [
    {
      "id": "q1",
      "type": "MCQ",
      "question": "Question text clear and concise?",
      "imageUrl": "",
      "options": [
        { "id": "A", "text": "Option A text" },
        { "id": "B", "text": "Option B text" },
        { "id": "C", "text": "Option C text" },
        { "id": "D", "text": "Option D text" }
      ],
      "correctAnswer": "B",
      "explanation": "Clear 1-2 sentence explanation why option B is correct.",
      "hint": "Helpful hint."
    }
  ]
}

STRICT QUIZ RULES:
- Generate exactly ${numQuestions} questions.
- Questions MUST focus strictly on this topic: ${topicFocus}
- "type" MUST be one of: "MCQ", "Image-based", or "Scenario-based".
- Each question MUST have EXACTLY 4 options with IDs "A", "B", "C", "D".
- "correctAnswer" MUST be EXACTLY ONE of "A", "B", "C", or "D".
- No duplicate option texts. No ambiguous questions.
- The explanation MUST support the selected correctAnswer.`;

  // Try Groq API if GROQ_API_KEY is configured
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 5) {
    const modelsToTry = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b'];

    for (const modelName of modelsToTry) {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an environmental civic education AI that outputs strictly valid JSON schema.'
            },
            {
              role: 'user',
              content: promptText
            }
          ],
          model: modelName,
          temperature: 0.2,
          response_format: { type: 'json_object' }
        });

        const responseText = chatCompletion.choices[0]?.message?.content || '';
        const parsed = parseGroqQuizResponse(responseText, category);
        if (parsed && parsed.length > 0) {
          console.log(`[GROQ QUIZ SERVICE] Successfully generated ${parsed.length} questions using ${modelName} for category "${category}"`);
          return parsed;
        }
      } catch (err) {
        console.warn(`[GROQ QUIZ SERVICE] Groq model ${modelName} call failed:`, err.message);
      }
    }
  }

  // Fallback to robust pre-configured topic questions if Groq API is unavailable
  console.log(`[GROQ QUIZ SERVICE] Using static fallback questions for category "${category}"`);
  return getFallbackQuestionsForCategory(category);
};

/**
 * Safely parse and validate Groq quiz response
 */
const parseGroqQuizResponse = (responseText, category) => {
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const data = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(data.questions) || data.questions.length === 0) return null;

    return data.questions.map((q, idx) => {
      const validOptions = (q.options || []).map((opt, oIdx) => {
        const optId = opt.id || String.fromCharCode(65 + oIdx);
        return {
          id: optId,
          text: typeof opt === 'string' ? opt : (opt.text || `Option ${optId}`)
        };
      });

      // Ensure exactly 4 options
      while (validOptions.length < 4) {
        const fallbackId = String.fromCharCode(65 + validOptions.length);
        validOptions.push({ id: fallbackId, text: `Additional Option ${fallbackId}` });
      }

      const validCorrectAnswer = ['A', 'B', 'C', 'D'].includes((q.correctAnswer || '').toUpperCase())
        ? q.correctAnswer.toUpperCase()
        : 'A';

      return {
        id: q.id || `q_${idx + 1}`,
        type: ['MCQ', 'Image-based', 'Scenario-based'].includes(q.type) ? q.type : 'MCQ',
        question: q.question || 'Civic Waste Management Question',
        imageUrl: q.imageUrl || '',
        options: validOptions.slice(0, 4),
        correctAnswer: validCorrectAnswer,
        explanation: q.explanation || `Option ${validCorrectAnswer} is correct for proper waste disposal.`,
        hint: q.hint || 'Think about proper waste stream segregation rules.'
      };
    });
  } catch (e) {
    console.error('[GROQ QUIZ SERVICE] Failed to parse JSON response:', e.message);
    return null;
  }
};

/**
 * Evaluate single question answer feedback using Groq
 */
const evaluateAnswerExplanation = async ({ questionText, options, correctAnswer, selectedAnswer, isCorrect }) => {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 5) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const prompt = `Explain why answer '${selectedAnswer}' is ${isCorrect ? 'CORRECT' : 'INCORRECT'} for this question:
Question: ${questionText}
Correct Answer: Option ${correctAnswer}

Return JSON format:
{"feedback": "1-2 sentence clear environmental feedback explanation."}`;

      const chat = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'openai/gpt-oss-20b',
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const responseText = chat.choices[0]?.message?.content || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.feedback) return parsed.feedback;
      }
    } catch (e) {
      console.warn('[GROQ QUIZ SERVICE] Answer evaluation feedback failed:', e.message);
    }
  }

  return isCorrect
    ? `Correct! Option ${correctAnswer} is the proper choice for this waste category.`
    : `Incorrect. Option ${correctAnswer} is the correct answer according to municipal guidelines.`;
};

/**
 * Fallback question generator with stable option IDs (A, B, C, D)
 */
const getFallbackQuestionsForCategory = (category = '') => {
  const catLower = category.toLowerCase();

  if (catLower.includes('wet') || catLower.includes('organic')) {
    return [
      {
        id: 'q1_wet',
        type: 'MCQ',
        question: 'Where should vegetable pulp, fruit peels, and leftover kitchen scraps be disposed of?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'Blue Bin (Dry / Recyclable Waste)' },
          { id: 'B', text: 'Green Bin (Wet / Organic Waste)' },
          { id: 'C', text: 'Black Bin (E-Waste Collection)' },
          { id: 'D', text: 'Red Bin (Hazardous Waste)' }
        ],
        correctAnswer: 'B',
        explanation: 'Kitchen food scraps and organic waste belong in the Green Bin for composting.',
        hint: 'Organic waste decomposes naturally.'
      },
      {
        id: 'q2_wet',
        type: 'Scenario-based',
        question: 'Scenario: You have tea leaves and eggshells from breakfast. What is the eco-friendly disposal method?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'Mix with plastic wrappers in dry bin' },
          { id: 'B', text: 'Add to compost or wet organic bin' },
          { id: 'C', text: 'Flush down the sink' },
          { id: 'D', text: 'Burn with dry leaves' }
        ],
        correctAnswer: 'B',
        explanation: 'Tea leaves and eggshells are nutrient-rich organic materials suitable for composting.',
        hint: 'Composting creates healthy soil fertilizer.'
      },
      {
        id: 'q3_wet',
        type: 'MCQ',
        question: 'Which of the following items is NOT suitable for the wet/organic waste stream?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'Banana peels' },
          { id: 'B', text: 'Stale bread' },
          { id: 'C', text: 'Plastic milk pouch' },
          { id: 'D', text: 'Spoiled vegetables' }
        ],
        correctAnswer: 'C',
        explanation: 'Plastic milk pouches do not decompose organically and must go to dry recycling.',
        hint: 'Plastics belong in dry recyclable streams.'
      }
    ];
  }

  if (catLower.includes('dry') || catLower.includes('recycling')) {
    return [
      {
        id: 'q1_dry',
        type: 'MCQ',
        question: 'Which plastic identification code indicates PET commonly used for beverage bottles?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'Resin Identification Code #1 (PET/PETE)' },
          { id: 'B', text: 'Resin Identification Code #3 (PVC)' },
          { id: 'C', text: 'Resin Identification Code #6 (PS)' },
          { id: 'D', text: 'Resin Identification Code #7 (OTHER)' }
        ],
        correctAnswer: 'A',
        explanation: 'Resin code #1 stands for Polyethylene Terephthalate (PET), highly recyclable.',
        hint: 'Look for code #1 on clean drinking bottles.'
      },
      {
        id: 'q2_dry',
        type: 'Scenario-based',
        question: 'Scenario: Before discarding clean cardboard packaging and plastic bottles, what should you do?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'Soak them in water and food waste' },
          { id: 'B', text: 'Flatten cardboard and rinse clean plastic bottles' },
          { id: 'C', text: 'Burn them in outdoor pile' },
          { id: 'D', text: 'Throw them in wet compost bin' }
        ],
        correctAnswer: 'B',
        explanation: 'Rinsing plastics and flattening cardboard prevents contamination and saves recycling transport space.',
        hint: 'Rinsing prevents food contamination.'
      },
      {
        id: 'q3_dry',
        type: 'MCQ',
        question: 'Clean tin cans, glass bottles, and dry paper should be placed in which bin?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'Green Bin (Wet Waste)' },
          { id: 'B', text: 'Blue Bin (Dry / Recyclable Waste)' },
          { id: 'C', text: 'Black Bin (E-Waste)' },
          { id: 'D', text: 'Red Bin (Hazardous)' }
        ],
        correctAnswer: 'B',
        explanation: 'Dry recyclables like metals, clean paper, and glass belong in the Blue Bin.',
        hint: 'Blue is the standard color for dry recyclables.'
      }
    ];
  }

  if (catLower.includes('e-waste') || catLower.includes('electronics')) {
    return [
      {
        id: 'q1_ewaste',
        type: 'Scenario-based',
        question: 'Scenario: You have old remote control lithium batteries and broken circuit boards. What is the correct action?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'Throw them into kitchen wet bin' },
          { id: 'B', text: 'Burn them in backyard' },
          { id: 'C', text: 'Drop them at authorized E-Waste collection points' },
          { id: 'D', text: 'Flush down drain' }
        ],
        correctAnswer: 'C',
        explanation: 'Batteries and electronics contain heavy metals that require specialized e-waste collection.',
        hint: 'E-waste requires specialized recovery.'
      },
      {
        id: 'q2_ewaste',
        type: 'MCQ',
        question: 'Why is discarding electronic waste in municipal landfills hazardous?',
        imageUrl: '',
        options: [
          { id: 'A', text: 'It melts instantly' },
          { id: 'B', text: 'Toxic metals like lead and mercury leach into groundwater' },
          { id: 'C', text: 'It creates pleasant scents' },
          { id: 'D', text: 'It attracts earthworms' }
        ],
        correctAnswer: 'B',
        explanation: 'Heavy metals in e-waste poison soil and drinking water if dumped in landfills.',
        hint: 'Think about heavy metal toxicity.'
      }
    ];
  }

  // Hazardous Waste Default
  return [
    {
      id: 'q1_haz',
      type: 'MCQ',
      question: 'Where should chemical cleaning solvents, paint cans, and expired medicine packaging be disposed of?',
      imageUrl: '',
      options: [
        { id: 'A', text: 'Green Organic Bin' },
        { id: 'B', text: 'Blue Recycling Bin' },
        { id: 'C', text: 'Red Bin (Hazardous Waste Stream)' },
        { id: 'D', text: 'Regular street drain' }
      ],
      correctAnswer: 'C',
      explanation: 'Hazardous chemicals and medical packaging require designated Red Bins for safe incineration/disposal.',
      hint: 'Red signifies danger/hazardous waste.'
    },
    {
      id: 'q2_haz',
      type: 'Scenario-based',
      question: 'Scenario: A broken fluorescent tube lamp contains mercury vapor. How should it be handled?',
      imageUrl: '',
      options: [
        { id: 'A', text: 'Crush it by hand' },
        { id: 'B', text: 'Carefully seal in double plastic bag and hand over to hazardous waste handler' },
        { id: 'C', text: 'Throw into wet compost bin' },
        { id: 'D', text: 'Burn in open fireplace' }
      ],
      correctAnswer: 'B',
      explanation: 'Fluorescent tubes contain mercury vapor requiring sealed hazardous waste disposal.',
      hint: 'Mercury is toxic when inhaled.'
    }
  ];
};

module.exports = {
  generateQuizQuestions,
  evaluateAnswerExplanation
};
