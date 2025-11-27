
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ICPProfile, Deal } from "../types";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (client) return client;
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. Gemini features will be disabled.");
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

  // Filter out system messages from history as 'history' prop doesn't support them directly in all SDK versions, 
  // or use config.systemInstruction for the persistent system prompt.
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

export const analyzeDeal = async (deal: any) => {
  const ai = getClient();
  if (!ai) return "AI analysis unavailable (Missing Key).";

  const prompt = `
    Analyze this deal and suggest the next best action to move it forward.
    Deal: ${JSON.stringify(deal)}
    
    Output a concise suggestion (max 2 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text;
  } catch (e) {
    return "Could not analyze deal.";
  }
};

export const generateSDRLeads = async (icp: ICPProfile) => {
    const ai = getClient();
    if (!ai) return null;

    // Use Maps tool to find grounding for the lead generation
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
    - website: string | null (The actual business website URL. Look for it!)
    - phone: string | null (The business phone number)
    - qualificationSummary: string (Analyze why they fit the ICP: ${icp.name}. Mention gaps like low reviews or no website if apparent)
    - talkingPoints: string[] (3 specific sales talking points based on their public data)
    - tier: "A" | "B" | "C" (A is high priority: e.g. good business but bad digital presence. C is already perfect or too small)
    - matchScore: number (0-100)
    
    IMPORTANT: Provide real data.
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
        // Sanitize markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Extract grounding metadata to get valid Google Maps URLs
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        let leads: any[] = [];
        try {
            // Attempt to find the array in the text if there's extra conversational text
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

        // Enhance leads with grounding data (Maps URLs)
        leads = leads.map(lead => {
             // Find a chunk that loosely matches the company name
             // Grounding chunks often contain the title and uri
             const chunk = groundingChunks.find(c => {
                 if (!c.web?.title) return false;
                 return c.web.title.toLowerCase().includes(lead.companyName.toLowerCase()) || 
                        lead.companyName.toLowerCase().includes(c.web.title.toLowerCase());
             });

             // If we found a chunk with a maps URI, use it.
             // If not, try to see if the address or other chunks align.
             // For now, we take the best guess.
             return {
                 ...lead,
                 googleMapsUrl: chunk?.web?.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.companyName + ' ' + lead.address)}`
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
    
    The email should be casual but professional, asking for a quick update or offering value based on the pain points. 
    Max 100 words. Do not include subject line in the body.
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
