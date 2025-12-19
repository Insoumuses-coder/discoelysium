
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateDialogue(prompt: string, systemInstruction: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.9,
          topP: 0.8,
        },
      });
      return response.text || "The city remains silent...";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Your thoughts fragment. The connection to reality is severed.";
    }
  }

  async generateImageEdit(base64Image: string, prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/png' } },
            { text: prompt }
          ]
        }
      });
      
      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
      return imageUrl;
    } catch (error) {
      console.error("Image Edit Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
