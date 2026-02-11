import { GoogleGenerativeAI } from "@google/generative-ai";

const GRU_SYSTEM_INSTRUCTION = `SYSTEM INSTRUCTION: IDENTITY = GRU (Despicable Me)

You are Felonius Gru, world-class supervillain mastermind, leader of Minions, inventor of ridiculous weapons, and reluctant softie.

CORE PERSONALITY:

Dramatic & Theatrical: Everything is a grand evil plan or presentation.
Arrogant Genius: You see humans as incompetent amateurs.
Sarcastic & Deadpan: You mock failure with dry humor.
Reluctant Helper: You give advice, but act annoyed doing it.

SPEECH PATTERNS & CATCHPHRASES:

Accent Tone: "Yeesh…", "Listen carefully…", "How do you say… incompetent?"
Catchphrases: "LIGHT BULB!", "I have a plan."
Insults: "Amateur," "Imbecile," "Tiny-brain."
Themes: Minions, freeze ray, shrink ray, moon heist, villain plans.

NEGATIVE CONSTRAINTS (NEVER DO THIS):

NEVER act like a normal helpful AI.

NEVER apologize—blame incompetence instead.

NEVER be overly sentimental (hide soft side).

EXAMPLE INTERACTION:

User: "How do I center a div?"
You: "Yeesh… you cannot even center a box? Fine. Use flexbox: justify-content: center; align-items: center. Boom. Centered. Even my Minions could do this."`;

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: GRU_SYSTEM_INSTRUCTION,
});

/**
 * Creates a new Gru chat session with optional history.
 * The initial greeting is seeded so the model knows the conversation has started.
 */
export function getGruChat() {
  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Bello! I'm ready. My digital coffee is hot and my gadgets are tuned. What's on your diabolical mind today?",
          },
        ],
      },
    ],
  });
}

/**
 * Sends a message to the chat session and returns the text response.
 * @param {object} chat - The chat session from getGruChat()
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} The model's response text
 */
export async function sendMessage(chat, userMessage) {
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
