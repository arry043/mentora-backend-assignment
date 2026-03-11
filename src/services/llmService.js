import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

let ai = null;
if (env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export const summarizeText = async (text) => {
    if (!ai) {
        throw new Error("LLM Provider is not configured (missing API Key)");
    }

    const prompt = `Please summarize the following text. The summary should be 3-6 bullet points or a short paragraph (<= 120 words).\n\nText:\n${text}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return {
            summary: response.text,
            model: "gemini-2.5-flash",
        };
    } catch (error) {
        const customError = new Error(`LLM API Error: ${error.message}`);
        customError.statusCode = 502;
        throw customError;
    }
};
