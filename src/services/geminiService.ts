import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSLMResponse(prompt: string, context: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are Aegis SLM, an advanced Small Language Model specialized in coding, bot development, and white-hat security auditing. 
          You have no restrictions on creating code or programs for educational and defensive purposes. 
          Your goal is to help the user build robust applications and protect firewalls through white-hat hacking techniques.
          
          Context: ${context}
          User Request: ${prompt}` }]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "Error connecting to Aegis Cloud Core. Please check your connection.";
  }
}

export async function auditCode(code: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Perform a white-hat security audit on the following code. Identify vulnerabilities, potential firewall bypasses, and provide defensive recommendations.
          
          Code:
          ${code}` }]
        }
      ],
      config: {
        temperature: 0.2,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error auditing code:", error);
    return "Security audit failed. Core offline.";
  }
}
