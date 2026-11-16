import type { KnowledgeDocument } from "../knowledge/purchaseKnowledge";

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: string;
  content: string;
}

export function chunkDocuments(
  documents: KnowledgeDocument[],
): KnowledgeChunk[] {
  return documents.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    content: item.content.trim(),
  }));
}
