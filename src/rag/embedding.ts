import { env } from "../config/env.js";

interface EmbeddingResponse {
  model: string;
  embeddings: number[][];
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts.length) {
    return [];
  }

  //   {
  //   "model": "bge-m3",
  //   "embeddings": [
  //     [0.0123, -0.0234, 0.0345],
  //     [0.0456, -0.0567, 0.0678]
  //   ]
  // }
  const response = await fetch(`${env.OLLAMA_BASE_URL}/api/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.EMBEDDING_MODEL,
      input: texts,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Embedding 请求失败: ${response.status} ${await response.text()}`,
    );
  }

  const result = (await response.json()) as EmbeddingResponse;

  if (result.embeddings.length !== texts.length) {
    throw new Error("Embedding 返回数量不匹配");
  }

  for (const embedding of result.embeddings) {
    if (
      embedding.length !== 1024 ||
      embedding.some((value) => !Number.isFinite(value))
    ) {
      throw new Error("Embedding 向量维度或数值异常");
    }
  }

  return result.embeddings;
}

// 将向量转换为 pgvector 可以识别的格式
export function toVectorString(vector: number[]): string {
  if (vector.length !== 1024) {
    throw new Error("向量维度必须为 1024");
  }

  return `[${vector.join(",")}]`;
}
