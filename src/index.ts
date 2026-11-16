import express from "express";
import { z } from "zod";
import { env } from "./config/env.js";
import { ragChat } from "./rag/ragService.js";

const app = express();

app.use(express.json());
const ChatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

app.post("/api/rag/chat", async (req, res) => {
  try {
    const parsed = ChatSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "请输入有效的问题",
        errors: parsed.error.issues,
      });
    }

    const result = await ragChat(parsed.data.message);
    console.log("result>>", result, req.body);

    return res.json({
      code: 200,
      data: result,
    });
  } catch (error) {
    console.error("RAG 请求失败:", error);

    return res.status(500).json({
      code: 500,
      message: "知识库问答失败",
    });
  }
});

app.listen(env.PORT, () => {
  console.log(`RAG 服务启动: http://localhost:${env.PORT}`);
});
