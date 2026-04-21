# Migração de Dados: localStorage para PostgreSQL

## 📋 Visão Geral

Este documento descreve como os dados foram migrados do localStorage para um banco de dados PostgreSQL persistente, permitindo que o dashboard CRM/SDR funcione com dados reais e duráveis.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

#### 1. **operatorData** - Dados de Performance dos Operadores
```sql
CREATE TABLE operatorData (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  data DATE NOT NULL,
  operador VARCHAR(255) NOT NULL,
  leads INT DEFAULT 0,
  ligacoes INT DEFAULT 0,
  atendidas INT DEFAULT 0,
  reunioesAgendadas INT DEFAULT 0,
  reunioesRealizadas INT DEFAULT 0,
  vendas INT DEFAULT 0,
  noShow INT DEFAULT 0,
  mrr DECIMAL(10, 2) DEFAULT 0.00,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

#### 2. **chatMessages** - Histórico de Mensagens de Suporte
```sql
CREATE TABLE chatMessages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  sender VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

#### 3. **operators** - Cadastro de Operadores
```sql
CREATE TABLE operators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **modules** - Módulos do Sistema
```sql
CREATE TABLE modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Fluxo de Migração

### Fase 1: Inicialização
Quando um usuário faz login pela primeira vez:
1. O frontend carrega dados do localStorage (se existirem)
2. O hook `useDatabasePersistence` verifica se o banco está vazio
3. Se vazio, inicia a migração automática

### Fase 2: Sincronização
Para cada tipo de dado:
- **Operator Data**: Migra registros de performance diários
- **Chat Messages**: Migra histórico de mensagens de suporte
- **Operators**: Migra lista de operadores cadastrados
- **Modules**: Migra lista de módulos do sistema

### Fase 3: Persistência Contínua
Após a migração inicial:
- Todos os novos dados são salvos automaticamente no banco
- O localStorage é mantido como fallback (opcional)
- Dados são sincronizados em tempo real

## 🎯 Como Usar

### No Frontend React

```tsx
import { useDatabasePersistence } from '@/hooks/useDatabasePersistence';

function MyComponent() {
  const {
    operatorData,      // Array de registros do banco
    chatMessages,      // Array de mensagens
    operators,         // Array de operadores
    modules,           // Array de módulos
    addOperatorData,   // Função para adicionar dados
    updateOperatorData,// Função para atualizar dados
    deleteOperatorData,// Função para deletar dados
    addChatMessage,    // Função para adicionar mensagem
    isLoading,         // Status de carregamento
    isError,           // Status de erro
  } = useDatabasePersistence();

  // Adicionar novo registro
  const handleAddData = async () => {
    try {
      await addOperatorData({
        data: '2026-04-18',
        operador: 'Paulo Santana',
        leads: 10,
        ligacoes: 8,
        atendidas: 6,
        reunioesAgendadas: 2,
        reunioesRealizadas: 1,
        vendas: 1,
        noShow: 0,
        mrr: '1500.00',
      });
    } catch (error) {
      console.error('Erro ao adicionar dados:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Salvando...</p>}
      {isError && <p>Erro ao salvar dados</p>}
      <button onClick={handleAddData}>Adicionar Dados</button>
      <pre>{JSON.stringify(operatorData, null, 2)}</pre>
    </div>
  );
}
```

## 🔌 Procedimentos tRPC Disponíveis

### Operator Data
```typescript
// Listar dados do usuário
trpc.operatorData.list.useQuery();

// Adicionar novo registro
trpc.operatorData.add.useMutation({
  data: '2026-04-18',
  operador: 'Nome',
  leads: 10,
  // ... outros campos
});

// Atualizar registro
trpc.operatorData.update.useMutation({
  id: 1,
  data: { leads: 15 }
});

// Deletar registro
trpc.operatorData.delete.useMutation({ id: 1 });
```

### Chat Messages
```typescript
// Listar mensagens
trpc.chatMessages.list.useQuery();

// Adicionar mensagem
trpc.chatMessages.add.useMutation({
  sender: 'user',
  text: 'Olá, preciso de ajuda'
});
```

### Operators
```typescript
// Listar operadores
trpc.operators.list.useQuery();

// Adicionar operador
trpc.operators.add.useMutation({ name: 'Novo Operador' });
```

### Modules
```typescript
// Listar módulos
trpc.modules.list.useQuery();

// Adicionar módulo
trpc.modules.add.useMutation({ name: 'Novo Módulo' });
```

## 🔒 Segurança

### Autenticação
- Todos os procedimentos tRPC exigem autenticação (`protectedProcedure`)
- Dados são isolados por usuário (userId)
- Usuários só podem acessar seus próprios dados

### Autorização
- Operações de CRUD verificam se o registro pertence ao usuário
- Tentativas de acessar dados de outros usuários são bloqueadas
- Logs de erro registram tentativas suspeitas

## 📊 Monitoramento

### Verificar Status da Migração

```sql
-- Contar registros migrados
SELECT COUNT(*) as total_operator_data FROM operatorData;
SELECT COUNT(*) as total_messages FROM chatMessages;
SELECT COUNT(*) as total_operators FROM operators;
SELECT COUNT(*) as total_modules FROM modules;

-- Ver dados de um usuário específico
SELECT * FROM operatorData WHERE userId = 1 ORDER BY data DESC;

-- Ver últimas mensagens
SELECT * FROM chatMessages WHERE userId = 1 ORDER BY timestamp DESC LIMIT 10;
```

## 🚀 Próximos Passos

1. **Executar migração do banco de dados**
   ```bash
   pnpm db:push
   ```

2. **Testar a sincronização**
   - Fazer login no dashboard
   - Verificar se dados aparecem
   - Adicionar novo registro
   - Recarregar página e verificar se persiste

3. **Monitorar performance**
   - Verificar tempo de carregamento
   - Monitorar uso de memória
   - Revisar logs de erro

4. **Otimizações futuras**
   - Adicionar paginação para grandes volumes
   - Implementar cache no frontend
   - Adicionar índices no banco para queries frequentes
   - Implementar soft delete para dados históricos

## ❓ Troubleshooting

### Dados não aparecem após login
1. Verificar se o banco está conectado: `SELECT 1;`
2. Verificar se o usuário existe: `SELECT * FROM users;`
3. Verificar logs do servidor para erros de conexão

### Erro ao salvar dados
1. Verificar se há espaço em disco
2. Verificar permissões do usuário do banco
3. Revisar logs para mensagens de erro específicas

### Performance lenta
1. Verificar índices: `SHOW INDEXES FROM operatorData;`
2. Executar ANALYZE TABLE para otimizar
3. Considerar arquivamento de dados antigos

## 📚 Referências

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [tRPC Documentation](https://trpc.io)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [React Query Documentation](https://tanstack.com/query/latest)
