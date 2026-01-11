
// Import the Google GenAI SDK and the Type enum for defining data structures
import { GoogleGenAI, Type } from "@google/genai";
// Import our pre-written instructions for the AI
import { ROAST_SYSTEM_PROMPT } from "../constants";
// Import our data types for safety
import { RoastResult, Category, RoastData } from "../types";

// The main function that talks to the Gemini API
export const generateRoast = async (category: Category, data: RoastData): Promise<RoastResult> => {
  // Initialize the AI client using the API key stored in the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Combine the category and user data into a single string to send to the AI
  const prompt = `Category: ${category}\nUser Data: ${JSON.stringify(data)}`;

  try {
    // Call the generateContent method to get a response from the model
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // We use the "flash" model for fast, snappy roasts
      contents: prompt,
      config: {
        // We give the AI its personality instructions here
        systemInstruction: ROAST_SYSTEM_PROMPT,
        // We tell the AI to respond in JSON format
        responseMimeType: "application/json",
        // We define the specific shape of JSON we want back
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

    // Parse the string response from the AI into a real JavaScript object
    const result = JSON.parse(response.text || "{}");
    
    // Return the data with fallback values in case the AI messed up
    return {
      roast: result.roast || "You're so boring even my AI brain can't find a way to insult you properly.",
      cookingLevel: result.cookingLevel || 5,
      verdict: result.verdict || "MEDIUM RARE",
    };
  } catch (error) {
    // If anything goes wrong (network issues, API errors), we log it and throw a helpful error message
    console.error("Gemini roasting error:", error);
    throw new Error("The stove wouldn't light. Maybe your life is just too bland to roast.");
  }
};
