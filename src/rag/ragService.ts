import { llmClient, llmModel } from "../config/llm.js";
import { retrieveKnowledge } from "./retriever.js";
import { RAG_SYSTEM_PROMPT } from "../prompts/ragPrompt.js";

export async function ragChat(question: string) {
  // 第一步：检索知识
  const knowledgeList = await retrieveKnowledge(question, 4);
  // 第二步：整理检索结果
  const context = knowledgeList
    .map((item, index) => {
      return `
            知识${index + 1}
            知识编号：${item.id}
            知识标题：${item.title}
            知识分类：${item.category}
            知识内容：
            ${item.content}
      `.trim();
    })
    .join("\n\n");

  // 第三步：组装用户消息
  const userContent = `
        用户问题：
        ${question}

        以下是从企业采购知识库中检索到的参考资料：

        <knowledge_context>
        ${context || "没有检索到相关知识。"}
        </knowledge_context>

        请根据以上资料回答用户问题。
  `.trim();

  // 第四步：调用 DeepSeek
  const completion = await llmClient.chat.completions.create({
    model: llmModel,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: RAG_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  // 第五步：返回回答和知识来源
  return {
    answer: completion.choices[0].message.content || "",
    sources: knowledgeList.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      similarity: Number(item.similarity),
    })),
  };
}
