
// Import dependencies
import { GoogleGenAI, Type } from "@google/genai";
import { ROAST_SYSTEM_PROMPT } from "../constants";
import { RoastResult, Category, RoastData } from "../types";

// Main AI interaction function
export const generateRoast = async (category: Category, data: RoastData): Promise<RoastResult> => {
  // Setup the AI with the environment API Key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Create a descriptive prompt for the AI
  const prompt = `Category: ${category}\nUser Input Data: ${JSON.stringify(data)}`;

  try {
    // Call Gemini with the dual persona instructions
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: ROAST_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        // Update schema to include the recommendations array
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            cookingLevel: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
          },
          required: ["roast", "recommendations", "cookingLevel", "verdict"],
        },
      },
    });

    // Parse the result
    const result = JSON.parse(response.text || "{}");
    
    // Return with safe defaults
    return {
      roast: result.roast || "Bad Cop is speechless at how mid you are.",
      recommendations: result.recommendations || ["Listen to some better music, please.", "Try playing outside.", "Watch some grass grow."],
      cookingLevel: result.cookingLevel || 5,
      verdict: result.verdict || "ABSOLUTELY MID",
    };
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("The Good Cop and Bad Cop are arguing. Try again later.");
  }
};
