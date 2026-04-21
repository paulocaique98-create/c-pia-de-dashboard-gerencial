-- Supabase Migration Script
-- Execute este script no SQL Editor do Supabase para criar todas as tabelas

-- 1. Criar tabela users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role VARCHAR(50) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Criar tabela operatorData
CREATE TABLE IF NOT EXISTS operatorData (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  operador VARCHAR(255) NOT NULL,
  leads INT DEFAULT 0 NOT NULL,
  ligacoes INT DEFAULT 0 NOT NULL,
  atendidas INT DEFAULT 0 NOT NULL,
  reunioesAgendadas INT DEFAULT 0 NOT NULL,
  reunioesRealizadas INT DEFAULT 0 NOT NULL,
  vendas INT DEFAULT 0 NOT NULL,
  noShow INT DEFAULT 0 NOT NULL,
  mrr NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Criar tabela chatMessages
CREATE TABLE IF NOT EXISTS chatMessages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Criar tabela operators
CREATE TABLE IF NOT EXISTS operators (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Criar tabela modules
CREATE TABLE IF NOT EXISTS modules (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_operatorData_userId ON operatorData(userId);
CREATE INDEX IF NOT EXISTS idx_operatorData_data ON operatorData(data);
CREATE INDEX IF NOT EXISTS idx_chatMessages_userId ON chatMessages(userId);
CREATE INDEX IF NOT EXISTS idx_chatMessages_timestamp ON chatMessages(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_openId ON users(openId);

-- 7. Habilitar RLS (Row Level Security) - Opcional mas recomendado
ALTER TABLE operatorData ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatMessages ENABLE ROW LEVEL SECURITY;

-- 8. Criar políticas RLS para operatorData
CREATE POLICY "Users can view their own operator data"
  ON operatorData FOR SELECT
  USING (auth.uid()::text = userId::text);

CREATE POLICY "Users can insert their own operator data"
  ON operatorData FOR INSERT
  WITH CHECK (auth.uid()::text = userId::text);

CREATE POLICY "Users can update their own operator data"
  ON operatorData FOR UPDATE
  USING (auth.uid()::text = userId::text);

CREATE POLICY "Users can delete their own operator data"
  ON operatorData FOR DELETE
  USING (auth.uid()::text = userId::text);

-- 9. Criar políticas RLS para chatMessages
CREATE POLICY "Users can view their own chat messages"
  ON chatMessages FOR SELECT
  USING (auth.uid()::text = userId::text);

CREATE POLICY "Users can insert their own chat messages"
  ON chatMessages FOR INSERT
  WITH CHECK (auth.uid()::text = userId::text);

-- 10. Inserir dados iniciais de operadores
INSERT INTO operators (name) VALUES
  ('Paulo Santana'),
  ('Jessica França'),
  ('Rafael Lima'),
  ('Natanael Barcelos'),
  ('André Moraes')
ON CONFLICT (name) DO NOTHING;

-- 11. Inserir dados iniciais de módulos
INSERT INTO modules (name) VALUES
  ('Dashboard'),
  ('Desempenho Diário'),
  ('Funil de Vendas'),
  ('Gestão de Operadores'),
  ('Gestão de Usuários'),
  ('Gestão de Módulos'),
  ('Chat de Suporte'),
  ('Perfil de Usuário')
ON CONFLICT (name) DO NOTHING;

-- Verificar se tudo foi criado com sucesso
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'operatorData', COUNT(*) FROM operatorData
UNION ALL
SELECT 'chatMessages', COUNT(*) FROM chatMessages
UNION ALL
SELECT 'operators', COUNT(*) FROM operators
UNION ALL
SELECT 'modules', COUNT(*) FROM modules;
