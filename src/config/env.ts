import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),

  OLLAMA_BASE_URL: z.string().url(),

  EMBEDDING_MODEL: z.string().default("bge-m3"),

  LLM_BASE_URL: z.string().url(),

  LLM_API_KEY: z.string().min(1),

  LLM_MODEL: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);
