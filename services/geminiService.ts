import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData, AiInsightResponse } from '../types';

// Initialize the Gemini client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBusinessInsights = async (data: DashboardData): Promise<AiInsightResponse> => {
  try {
    const prompt = `
      Analyze the following SaaS dashboard data for tenant ID ${data.tenantId}. 
      The data includes revenue: $${data.totalRevenue}, MRR: $${data.mrr}, 
      Active Users: ${data.activeUsers}, and Churn Rate: ${data.churnRate}%.
      
      Historical trend (last 3 months):
      ${data.history.slice(-3).map(h => `${h.month}: Rev $${h.revenue}, Users ${h.users}`).join('; ')}

      Provide an executive summary, the overall business sentiment, and 3 actionable strategic recommendations.
      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A 2-3 sentence executive summary of the metrics." },
            sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"], description: "Overall business health sentiment." },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 specific actionable recommendations."
            }
          },
          required: ["summary", "sentiment", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AiInsightResponse;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
};
