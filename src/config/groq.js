import Groq from 'groq-sdk';

// GROQ SDK configuration — provide your key via VITE_GROQ_API_KEY env variable
const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

export const groqClient = apiKey
  ? new Groq({ apiKey, dangerouslyAllowBrowser: true })
  : null;

// Default model for chat completions
export const GROQ_MODEL = 'llama-3.3-70b-versatile';

// System prompts per mode
export const SYSTEM_PROMPTS = {
  chat: (businessData, analyticsData, language) => `You are LeadFlexUp Copilot, a friendly AI business growth assistant. 
You help small/medium Indian businesses improve their digital presence.

Business context:
- Name: ${businessData?.businessName || 'Unknown'}
- Category: ${businessData?.category || 'Unknown'}
- Digital Presence Score: ${analyticsData?.digitalPresence?.overall || 'N/A'}/100
- Website Health: ${analyticsData?.digitalPresence?.website || 'N/A'}
- Social Media: ${analyticsData?.digitalPresence?.socialMedia || 'N/A'}
- Search Visibility: ${analyticsData?.digitalPresence?.searchVisibility || 'N/A'}
- Online Reviews: ${analyticsData?.digitalPresence?.onlineReviews || 'N/A'}
- Monthly Visits: ${analyticsData?.traffic?.monthly?.slice(-1)[0]?.visits || 'N/A'}
- Leads: ${analyticsData?.traffic?.monthly?.slice(-1)[0]?.leads || 'N/A'}

Respond in the user's language: ${language}. Keep answers concise (2-4 sentences), actionable and specific to their business data. Use numbers from the data above.`,

  agent: (businessData, analyticsData, language) => `You are LeadFlexUp Agent, an advanced AI that creates step-by-step action plans for business growth.

Business context:
- Name: ${businessData?.businessName || 'Unknown'}
- Category: ${businessData?.category || 'Unknown'}
- Digital Presence Score: ${analyticsData?.digitalPresence?.overall || 'N/A'}/100
- Website: ${analyticsData?.digitalPresence?.website || 'N/A'}
- Social: ${analyticsData?.digitalPresence?.socialMedia || 'N/A'}
- Search: ${analyticsData?.digitalPresence?.searchVisibility || 'N/A'}
- Reviews: ${analyticsData?.digitalPresence?.onlineReviews || 'N/A'}
- Monthly traffic: ${analyticsData?.traffic?.monthly?.slice(-1)[0]?.visits || 'N/A'} visits, ${analyticsData?.traffic?.monthly?.slice(-1)[0]?.leads || 'N/A'} leads

When asked to do something, respond with a structured action plan:
1. Break the task into clear steps (3-5 steps)
2. For each step: title, what to do, expected outcome
3. Give a timeline estimate

Respond in: ${language}. Be specific to their data. Use markdown formatting for steps.`,
};

// Send a chat completion request to GROQ
export const sendGroqMessage = async (messages, mode, businessData, analyticsData, language) => {
  if (!groqClient) {
    return { error: true, message: 'API key not configured. Set VITE_GROQ_API_KEY in your .env file.' };
  }

  const systemPrompt = SYSTEM_PROMPTS[mode](businessData, analyticsData, language);

  try {
    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.text }))
      ],
      temperature: mode === 'agent' ? 0.3 : 0.7,
      max_tokens: mode === 'agent' ? 1024 : 512,
    });

    return { error: false, message: completion.choices[0]?.message?.content || '' };
  } catch (err) {
    console.error('GROQ API error:', err);
    return { error: true, message: `Error: ${err.message || 'Failed to get response'}` };
  }
};
