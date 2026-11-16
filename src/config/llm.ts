import OpenAI from "openai";
import { env } from "./env.js";

export const llmClient = new OpenAI({
  apiKey: env.LLM_API_KEY,
  baseURL: env.LLM_BASE_URL,
});

export const llmModel = env.LLM_MODEL;
