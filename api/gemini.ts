import { GoogleGenAI } from '@google/genai';

interface RequestBody {
  prompt?: string;
}

/**
 * Vercel Serverless Function Handler
 * Route: POST /api/gemini
 *
 * Calls Google Gemini (gemini-2.5-flash) securely using process.env.GEMINI_API_KEY
 * and returns { text: string } as JSON.
 */
export default async function handler(req: any, res: any) {
  // Helper to send JSON responses across Vercel and Node HTTP runtimes
  const sendJson = (statusCode: number, payload: Record<string, unknown>) => {
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(statusCode).json(payload);
    }
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };

  // Only accept POST requests
  if (req.method !== 'POST') {
    return sendJson(405, { error: 'Method Not Allowed. Please use POST.' });
  }

  try {
    // Parse request body safely
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use raw body
      }
    }

    const { prompt } = (body || {}) as RequestBody;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return sendJson(400, {
        error: 'Missing or invalid "prompt" in request body.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in environment variables.');
      return sendJson(500, {
        error: 'GEMINI_API_KEY is not configured in environment variables.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Call Google Gemini using gemini-2.5-flash as strictly required
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt.trim(),
    });

    const text = response.text || '';
    return sendJson(200, { text });
  } catch (error: any) {
    console.error('Error in /api/gemini serverless function:', error);
    return sendJson(500, {
      error:
        error?.message ||
        'Internal Server Error while communicating with Google Gemini API.',
    });
  }
}
