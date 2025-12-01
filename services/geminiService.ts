
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ICPProfile, Deal, Customer } from "../types";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (client) return client;
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found. Gemini features disabled.");
    return null;
  }
  client = new GoogleGenAI({ apiKey });
  return client;
};

// --- Function Declarations ---

const listDealsFunction: FunctionDeclaration = {
  name: 'list_deals',
  parameters: {
    type: Type.OBJECT,
    description: 'List deals with optional filters, sort, and limit.',
    properties: {
      limit: { type: Type.NUMBER, description: 'Max number of deals to return' },
      stage: { type: Type.STRING, description: 'Filter by deal stage' }
    }
  }
};

const draftEmailFunction: FunctionDeclaration = {
  name: 'draft_email',
  parameters: {
    type: Type.OBJECT,
    description: 'Generate an email draft for a specific deal.',
    properties: {
      dealId: { type: Type.STRING, description: 'The ID of the deal' },
      context: { type: Type.STRING, description: 'Instructions for the email content' }
    },
    required: ['dealId']
  }
};

// --- Agent Functions ---

export const getCommandCenterResponse = async (
  history: { role: 'user' | 'model' | 'system'; content: string }[],
  userMessage: string
) => {
  const ai = getClient();
  if (!ai) {
    return { 
      text: "I'm sorry, but I'm not connected to the Gemini API. Please configure your API key.", 
      functionCalls: [] 
    };
  }

  const chatHistory = history
    .filter(h => h.role !== 'system')
    .map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }));

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: chatHistory,
    config: {
      systemInstruction: "You are an AI assistant for a CRM called 'Agentic CRM'. You help solopreneurs manage leads and deals. You can list deals and draft emails.",
      tools: [{ functionDeclarations: [listDealsFunction, draftEmailFunction] }],
    }
  });

  try {
    const result = await chat.sendMessage({ message: userMessage });
    return {
      text: result.text || "I've processed that.",
      functionCalls: result.functionCalls || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Sorry, I encountered an error processing your request.", functionCalls: [] };
  }
};

export const generateSDRLeads = async (icp: ICPProfile) => {
    const ai = getClient();
    if (!ai) return null;

    const prompt = `
    Find 5 real businesses that match the profile: "${icp.categories.join(', ')} in ${icp.geography}".
    
    Use Google Maps to find the businesses. 
    CRITICAL: Use Google Search to find their actual WEBSITE URL and PHONE NUMBER if not immediately available in the Maps data.
    
    Return a JSON array where each object has these exact fields:
    - companyName: string
    - category: string
    - rating: number
    - reviews: number
    - address: string
    - website: string | null
    - phone: string | null
    - qualificationSummary: string (Analyze why they fit the ICP: ${icp.name}.)
    - talkingPoints: string[] (3 specific sales talking points)
    - tier: "A" | "B" | "C" (A is high priority)
    - matchScore: number (0-100)
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }, { googleSearch: {} }],
            }
        });
        
        let text = response.text || "[]";
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        let leads: any[] = [];
        try {
            const jsonStart = text.indexOf('[');
            const jsonEnd = text.lastIndexOf(']');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                text = text.substring(jsonStart, jsonEnd + 1);
            }
            leads = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse JSON from SDR agent", text);
            return null;
        }

        leads = leads.map(lead => {
             // Find matching chunk. Maps chunks are preferred.
             const chunk = groundingChunks.find(c => {
                 const title = c.maps?.title || c.web?.title || "";
                 return title && (
                    title.toLowerCase().includes(lead.companyName.toLowerCase()) || 
                    lead.companyName.toLowerCase().includes(title.toLowerCase())
                 );
             });

             // Extract Maps URI
             let googleMapsUrl = chunk?.maps?.uri;
             
             // Fallback if no direct maps URI, construct a search URL
             if (!googleMapsUrl) {
                 googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.companyName + ' ' + (lead.address || icp.geography))}`;
             }

             return {
                 ...lead,
                 googleMapsUrl
             };
        });
        
        return { leads, groundingChunks };
    } catch (e) {
        console.error("SDR Agent Error:", e);
        return null;
    }
};

export const generateOutreachEmail = async (deal: Deal, contactName: string, companyName: string, companyContext?: any) => {
    const ai = getClient();
    if (!ai) return "AI composition unavailable.";

    let contextStr = `
    Deal Name: ${deal.name}
    Company: ${companyName}
    Contact: ${contactName}
    Stage: ${deal.stage}
    Last Interaction: ${deal.lastTouchDate}
    Value: $${deal.value}
    `;

    if (companyContext) {
        contextStr += `
        Company Rating: ${companyContext.rating} stars
        Pain Points: ${companyContext.painPoints?.join(', ')}
        Sales Opportunities: ${companyContext.salesOpportunities?.join(', ')}
        `;
    }

    const prompt = `
    You are a world-class sales copywriter. Write a personalized, short, and punchy follow-up email for a deal.
    
    Context:
    ${contextStr}
    
    The email should be casual but professional. Max 100 words.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text;
    } catch (e) {
        return "Could not generate draft.";
    }
};
