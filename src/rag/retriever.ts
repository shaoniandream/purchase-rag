import { pool } from "../config/database.js";
import { generateEmbeddings, toVectorString } from "./embedding.js";

export interface RetrievedKnowledge {
  id: string;
  title: string;
  content: string;
  category: string;
  distance: number;
  similarity: number;
}

export async function retrieveKnowledge(
  question: string,
  topK = 4,
): Promise<RetrievedKnowledge[]> {
  // 1. 将用户问题转换成向量
  const [queryVector] = await generateEmbeddings([question]);

  // 2. 向量格式转换
  const vectorString = toVectorString(queryVector);

  // 3. 查询最相似的知识
  const result = await pool.query<RetrievedKnowledge>(
    `
    SELECT
      id,
      title,
      content,
      category,
      embedding <=> $1::vector AS distance,
      1 - (embedding <=> $1::vector) AS similarity
    FROM purchase_knowledge
    ORDER BY embedding <=> $1::vector
    LIMIT $2
    `,
    [vectorString, topK],
  );

  return result.rows;
}
