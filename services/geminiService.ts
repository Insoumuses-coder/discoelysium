
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  async generateDialogue(prompt: string, systemInstruction: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.95,
        },
      });
      return response.text || "...";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Your thoughts fragment. The connection to reality is severed.";
    }
  }
}

export const geminiService = new GeminiService();
