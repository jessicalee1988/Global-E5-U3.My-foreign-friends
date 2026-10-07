/**
 * Frontend Gemini Service
 *
 * Securely communicates with Google Gemini by calling the serverless
 * endpoint /api/gemini. Does NOT import GoogleGenerativeAI or expose
 * the API key to the client.
 */

export interface GeminiResponse {
  text: string;
}

/**
 * Generate text using Google Gemini through the /api/gemini serverless endpoint.
 *
 * @param prompt - The text prompt to send to Gemini
 * @returns The generated response text
 */
export async function generateContent(prompt: string): Promise<string> {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('A valid prompt string is required.');
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Gemini API request failed with status ${response.status}`
    );
  }

  const data: GeminiResponse = await response.json();
  return data.text;
}

/**
 * Alias helper function for convenience
 */
export async function askGemini(prompt: string): Promise<string> {
  return generateContent(prompt);
}

export default {
  generateContent,
  askGemini,
};
