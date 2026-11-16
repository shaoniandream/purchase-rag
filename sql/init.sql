
-- 开启 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建采购知识表
CREATE TABLE IF NOT EXISTS purchase_knowledge (
  id VARCHAR(100) PRIMARY KEY,

  title VARCHAR(255) NOT NULL,

  content TEXT NOT NULL,

  category VARCHAR(100) NOT NULL,

  embedding VECTOR(1024) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 普通分类索引
CREATE INDEX IF NOT EXISTS idx_purchase_knowledge_category
ON purchase_knowledge(category);
