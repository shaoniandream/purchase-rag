import { generateEmbeddings } from "../rag/embedding.js";

async function main() {
  const texts = [
    "采购申请必须包含产品名称和采购数量",
    "打印机支持黑白激光打印",
  ];

  const vectors = await generateEmbeddings(texts);
  console.log("向量数量:", vectors.length);
  console.log("向量维度:", vectors[0]?.length);
  console.log("向量前五个值:", vectors[0]?.slice(0, 5));
}

main();
