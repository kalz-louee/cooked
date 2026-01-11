
import { GoogleGenAI, Type } from "@google/genai";
import { ROAST_SYSTEM_PROMPT } from "../constants";
import { RoastResult, Category, RoastData } from "../types";

export const generateRoast = async (category: Category, data: RoastData): Promise<RoastResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Category: ${category}\nUser Data: ${JSON.stringify(data)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: ROAST_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: { type: Type.STRING },
            cookingLevel: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
          },
          required: ["roast", "cookingLevel", "verdict"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      roast: result.roast || "You're so boring even my AI brain can't find a way to insult you properly. Try having a personality.",
      cookingLevel: result.cookingLevel || 5,
      verdict: result.verdict || "MEDIUM RARE",
    };
  } catch (error) {
    console.error("Gemini roasting error:", error);
    throw new Error("The stove wouldn't light. Maybe your life is just too bland to roast.");
  }
};
