import { pool } from "../config/database.js";
import { purchaseKnowledge } from "../knowledge/purchaseKnowledge.js";
import { chunkDocuments } from "./chunk.js";
import { generateEmbeddings, toVectorString } from "./embedding.js";

async function ingestKnowledge() {
  const chunks = chunkDocuments(purchaseKnowledge);

  console.log(`准备处理 ${chunks.length} 条知识`);

  // 批量生成向量
  const batchSize = 5;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    const vectors = await generateEmbeddings(batch.map((item) => item.content));

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (let j = 0; j < batch.length; j++) {
        const item = batch[j];

        await client.query(
          `
          INSERT INTO purchase_knowledge (
            id,
            title,
            content,
            category,
            embedding,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5::vector, NOW())
          ON CONFLICT (id)
          DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            category = EXCLUDED.category,
            embedding = EXCLUDED.embedding,
            updated_at = NOW()
          `,
          [
            item.id,
            item.title,
            item.content,
            item.category,
            toVectorString(vectors[j]),
          ],
        );
      }

      await client.query("COMMIT");

      console.log(
        `已完成 ${Math.min(i + batch.length, chunks.length)}/${chunks.length}`,
      );
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  console.log("采购知识库入库完成");
}

ingestKnowledge()
  .catch(console.error)
  .finally(() => pool.end());
