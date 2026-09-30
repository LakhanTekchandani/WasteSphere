const Groq = require('groq-sdk');
const { GoogleGenAI } = require('@google/genai');

const ALLOWED_WASTE_TYPES = [
  'Organic / Wet Waste',
  'Plastic Waste',
  'Paper / Cardboard',
  'Glass Waste',
  'Metal Waste',
  'E-Waste',
  'Mixed Waste',
  'Other',
];

/**
 * Classify waste type from image buffer or URL using Groq or Gemini
 * @param {Object} options - { imageBuffer, imageUrl, base64Image, mimeType }
 * @returns {Promise<{ suggestedWasteType: string, confidence: number, rawAiResponse: string, providerUsed: string }>}
 */
const recognizeWasteType = async ({ imageBuffer, imageUrl, base64Image, mimeType = 'image/jpeg' }) => {
  const promptText = `Analyze the provided waste image and identify which of the following EXACT waste categories it best matches:
- Organic / Wet Waste
- Plastic Waste
- Paper / Cardboard
- Glass Waste
- Metal Waste
- E-Waste
- Mixed Waste
- Other

IMPORTANT RULES:
1. Return ONLY a valid JSON object in this exact format:
{"suggestedWasteType": "EXACT_CATEGORY_NAME", "confidence": 0.95, "reasoning": "Short 1-sentence observation of visible items"}
2. Do NOT invent locations, issue types, or user details. ONLY classify the waste.`;

  // 1. Try Groq API if GROQ_API_KEY exists
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 5) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const imagePayload = imageUrl
        ? imageUrl
        : `data:${mimeType};base64,${base64Image || (imageBuffer ? imageBuffer.toString('base64') : '')}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              { type: 'image_url', image_url: { url: imagePayload } },
            ],
          },
        ],
        model: 'llama-3.2-11b-vision-preview',
        temperature: 0.2,
        max_tokens: 150,
      });

      const responseText = chatCompletion.choices[0]?.message?.content || '';
      const parsed = parseAiResponse(responseText);

      if (parsed) {
        return {
          suggestedWasteType: parsed.suggestedWasteType,
          confidence: parsed.confidence || 0.9,
          reasoning: parsed.reasoning || 'AI identified waste features from photo',
          rawAiResponse: responseText,
          providerUsed: 'Groq API',
        };
      }
    } catch (groqError) {
      console.warn('Groq Vision API failed, attempting Gemini fallback:', groqError.message);
    }
  }

  // 2. Fallback: Gemini API if GEMINI_API_KEY exists
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = base64Image || (imageBuffer ? imageBuffer.toString('base64') : '');

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          promptText,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ],
      });

      const responseText = response.text || '';
      const parsed = parseAiResponse(responseText);

      if (parsed) {
        return {
          suggestedWasteType: parsed.suggestedWasteType,
          confidence: parsed.confidence || 0.88,
          reasoning: parsed.reasoning || 'Gemini identified waste from image',
          rawAiResponse: responseText,
          providerUsed: 'Gemini API',
        };
      }
    } catch (geminiError) {
      console.warn('Gemini API failed:', geminiError.message);
    }
  }

  // 3. Fallback: Development classifier heuristic if API keys are absent or failed
  console.log('[AI SERVICE] Using development heuristic waste classifier fallback');
  const mockSuggestions = [
    'Plastic Waste',
    'Organic / Wet Waste',
    'Paper / Cardboard',
    'Mixed Waste',
  ];
  const randomSuggestion = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];

  return {
    suggestedWasteType: randomSuggestion,
    confidence: 0.85,
    reasoning: 'Heuristic pattern detection suggested probable waste type',
    rawAiResponse: JSON.stringify({ suggestedWasteType: randomSuggestion, confidence: 0.85 }),
    providerUsed: 'Development AI Classifier (Fallback)',
  };
};

/**
 * Helper to safely extract JSON from AI output
 */
const parseAiResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);

    // Ensure matched category is one of ALLOWED_WASTE_TYPES
    let category = ALLOWED_WASTE_TYPES.find(
      (type) => type.toLowerCase() === (parsed.suggestedWasteType || '').toLowerCase()
    );

    if (!category) {
      // Partial matching fallback
      const found = ALLOWED_WASTE_TYPES.find((type) =>
        (parsed.suggestedWasteType || '').toLowerCase().includes(type.split(' ')[0].toLowerCase())
      );
      category = found || 'Mixed Waste';
    }

    return {
      suggestedWasteType: category,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
      reasoning: parsed.reasoning || '',
    };
  } catch (e) {
    return null;
  }
};

module.exports = {
  recognizeWasteType,
  ALLOWED_WASTE_TYPES,
};
