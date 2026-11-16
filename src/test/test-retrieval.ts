import { retrieveKnowledge } from "../rag/retriever.js";

async function main() {
  const question = "采购申请需要包含哪些信息？";

  const result = await retrieveKnowledge(question, 4);

  console.log("用户问题:", question);

  console.log("检索结果:");

  result.forEach((item, index) => {
    console.log(`\n第 ${index + 1} 条`);

    console.log("知识编号:", item.id);
    console.log("知识标题:", item.title);
    console.log("知识分类:", item.category);
    console.log("余弦距离:", item.distance);
    console.log("余弦相似度:", item.similarity);
    console.log("知识内容:", item.content);
  });
}

main().catch(console.error);
