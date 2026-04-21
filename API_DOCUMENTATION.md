# 📚 Documentação de Integração - API Impacto Tecnologia CRM

**Versão:** 1.0  
**Data:** Abril 2026  
**Autor:** Manus AI  
**Status:** Pronto para Produção

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Operações Disponíveis](#operações-disponíveis)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Webhooks e Integrações](#webhooks-e-integrações)

---

## 🔍 Visão Geral

O Impacto Tecnologia CRM utiliza **tRPC** como camada de integração. Todas as operações são realizadas através de **Queries (GET)** e **Mutations (POST/PUT/PATCH/DELETE)** tipadas.

### Características Principais

- **Tipagem Completa:** Todas as operações são fortemente tipadas com TypeScript
- **Autenticação Integrada:** Suporte a OAuth e autenticação baseada em sessão
- **Persistência em Banco de Dados:** PostgreSQL via Supabase
- **Autorização por Papel:** Suporte a `admin` e `user`
- **Validação de Dados:** Todas as entradas são validadas com Zod

### Endpoint Base

```
POST /api/trpc/{procedure}
```

**Exemplo:**
```
POST /api/trpc/operatorData.add
```

---

## 🔐 Autenticação

### Tipos de Procedimento

| Tipo | Descrição | Requer Autenticação | Requer Admin |
|------|-----------|-------------------|--------------|
| `publicProcedure` | Acessível sem autenticação | ❌ Não | ❌ Não |
| `protectedProcedure` | Requer usuário autenticado | ✅ Sim | ❌ Não |
| `adminProcedure` | Requer usuário com role `admin` | ✅ Sim | ✅ Sim |

### Fluxo de Autenticação

1. Usuário faz login via OAuth Manus
2. Sistema cria sessão com cookie `manus_session`
3. Cada requisição tRPC valida o cookie automaticamente
4. Se não autenticado, retorna erro `UNAUTHORIZED`
5. Se não é admin, retorna erro `FORBIDDEN`

### Headers Necessários

```http
Cookie: manus_session=<session_token>
Content-Type: application/json
```

---

## 📊 Estrutura de Dados

### Tabela: Users (Usuários)

```typescript
interface User {
  id: number;                    // ID único (auto-incrementado)
  openId: string;                // Identificador OAuth (único)
  name: string | null;           // Nome completo
  email: string | null;          // Email
  loginMethod: string | null;    // Método de login (oauth, etc)
  role: 'user' | 'admin';        // Papel do usuário
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de última atualização
  lastSignedIn: Date;            // Último acesso
}
```

### Tabela: OperatorData (Dados de Operadores)

```typescript
interface OperatorData {
  id: number;                    // ID único (auto-incrementado)
  userId: number;                // ID do usuário proprietário
  data: Date;                    // Data do registro
  operador: string;              // Nome do operador
  leads: number;                 // Quantidade de leads entregues
  ligacoes: number;              // Quantidade de ligações realizadas
  atendidas: number;             // Ligações atendidas
  reunioesAgendadas: number;     // Reuniões agendadas
  reunioesRealizadas: number;    // Reuniões realizadas
  vendas: number;                // Quantidade de vendas
  noShow: number;                // Quantidade de no-shows
  mrr: string;                   // MRR (Monthly Recurring Revenue)
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de última atualização
}
```

### Tabela: ChatMessages (Mensagens de Chat)

```typescript
interface ChatMessage {
  id: number;                    // ID único (auto-incrementado)
  userId: number;                // ID do usuário
  sender: string;                // Quem enviou ('user' ou 'admin')
  text: string;                  // Conteúdo da mensagem
  timestamp: Date;               // Data/hora da mensagem
}
```

### Tabela: Operators (Operadores)

```typescript
interface Operator {
  id: number;                    // ID único (auto-incrementado)
  name: string;                  // Nome do operador (único)
  createdAt: Date;               // Data de criação
}
```

### Tabela: Modules (Módulos)

```typescript
interface Module {
  id: number;                    // ID único (auto-incrementado)
  name: string;                  // Nome do módulo (único)
  createdAt: Date;               // Data de criação
}
```

---

## 🔧 Operações Disponíveis

### 1. Autenticação

#### 1.1 GET - Obter Usuário Atual

**Endpoint:** `auth.me`  
**Tipo:** `publicProcedure` (Query)  
**Autenticação:** ✅ Requer  
**Descrição:** Retorna informações do usuário autenticado

**Request:**
```typescript
const user = await trpc.auth.me.useQuery();
```

**Response (Sucesso):**
```json
{
  "id": 1,
  "openId": "user_123",
  "name": "Paulo Santana",
  "email": "paulo@impacto.com",
  "role": "admin",
  "lastSignedIn": "2026-04-21T21:30:00Z"
}
```

**Response (Erro):**
```json
{
  "code": "UNAUTHORIZED",
  "message": "Please login (10001)"
}
```

---

#### 1.2 POST - Logout

**Endpoint:** `auth.logout`  
**Tipo:** `publicProcedure` (Mutation)  
**Autenticação:** ✅ Requer  
**Descrição:** Encerra a sessão do usuário

**Request:**
```typescript
const result = await trpc.auth.logout.useMutation();
result.mutate();
```

**Response (Sucesso):**
```json
{
  "success": true
}
```

---

### 2. Dados de Operadores

#### 2.1 GET - Listar Dados de Operadores

**Endpoint:** `operatorData.list`  
**Tipo:** `protectedProcedure` (Query)  
**Autenticação:** ✅ Requer  
**Descrição:** Retorna todos os registros de dados de operadores do usuário

**Request:**
```typescript
const { data: operatorData } = await trpc.operatorData.list.useQuery();
```

**Response (Sucesso):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "data": "2026-04-21",
    "operador": "Paulo Santana",
    "leads": 10,
    "ligacoes": 5,
    "atendidas": 4,
    "reunioesAgendadas": 2,
    "reunioesRealizadas": 1,
    "vendas": 1,
    "noShow": 1,
    "mrr": "5000.00",
    "createdAt": "2026-04-21T20:00:00Z",
    "updatedAt": "2026-04-21T20:00:00Z"
  }
]
```

---

#### 2.2 POST - Adicionar Dados de Operador

**Endpoint:** `operatorData.add`  
**Tipo:** `protectedProcedure` (Mutation)  
**Autenticação:** ✅ Requer  
**Descrição:** Cria um novo registro de dados de operador

**Request:**
```typescript
const mutation = trpc.operatorData.add.useMutation();
mutation.mutate({
  data: "2026-04-21",
  operador: "Paulo Santana",
  leads: 10,
  ligacoes: 5,
  atendidas: 4,
  reunioesAgendadas: 2,
  reunioesRealizadas: 1,
  vendas: 1,
  noShow: 0,
  mrr: "5000.00"
});
```

**Validação de Entrada:**
```typescript
{
  data: string (ISO date format)              // ✅ Obrigatório
  operador: string                            // ✅ Obrigatório
  leads: number (inteiro)                     // ❌ Opcional (padrão: 0)
  ligacoes: number (inteiro)                  // ❌ Opcional (padrão: 0)
  atendidas: number (inteiro)                 // ❌ Opcional (padrão: 0)
  reunioesAgendadas: number (inteiro)         // ❌ Opcional (padrão: 0)
  reunioesRealizadas: number (inteiro)        // ❌ Opcional (padrão: 0)
  vendas: number (inteiro)                    // ❌ Opcional (padrão: 0)
  noShow: number (inteiro)                    // ❌ Opcional (padrão: 0)
  mrr: string (formato decimal)               // ❌ Opcional (padrão: "0.00")
}
```

**Response (Sucesso):**
```json
{
  "id": 1,
  "userId": 1,
  "data": "2026-04-21",
  "operador": "Paulo Santana",
  "leads": 10,
  "ligacoes": 5,
  "atendidas": 4,
  "reunioesAgendadas": 2,
  "reunioesRealizadas": 1,
  "vendas": 1,
  "noShow": 0,
  "mrr": "5000.00",
  "createdAt": "2026-04-21T20:00:00Z",
  "updatedAt": "2026-04-21T20:00:00Z"
}
```

---

#### 2.3 PUT/PATCH - Atualizar Dados de Operador

**Endpoint:** `operatorData.update`  
**Tipo:** `protectedProcedure` (Mutation)  
**Autenticação:** ✅ Requer  
**Descrição:** Atualiza um registro existente de dados de operador

**Request:**
```typescript
const mutation = trpc.operatorData.update.useMutation();
mutation.mutate({
  id: 1,
  data: {
    leads: 15,
    vendas: 2,
    mrr: "7500.00"
  }
});
```

**Validação de Entrada:**
```typescript
{
  id: number (inteiro)                        // ✅ Obrigatório
  data: {
    data?: string (ISO date format)           // ❌ Opcional
    operador?: string                         // ❌ Opcional
    leads?: number (inteiro)                  // ❌ Opcional
    ligacoes?: number (inteiro)               // ❌ Opcional
    atendidas?: number (inteiro)              // ❌ Opcional
    reunioesAgendadas?: number (inteiro)      // ❌ Opcional
    reunioesRealizadas?: number (inteiro)     // ❌ Opcional
    vendas?: number (inteiro)                 // ❌ Opcional
    noShow?: number (inteiro)                 // ❌ Opcional
    mrr?: string (formato decimal)            // ❌ Opcional
  }
}
```

**Response (Sucesso):**
```json
{}
```

---

#### 2.4 DELETE - Deletar Dados de Operador

**Endpoint:** `operatorData.delete`  
**Tipo:** `protectedProcedure` (Mutation)  
**Autenticação:** ✅ Requer  
**Descrição:** Remove um registro de dados de operador

**Request:**
```typescript
const mutation = trpc.operatorData.delete.useMutation();
mutation.mutate({ id: 1 });
```

**Validação de Entrada:**
```typescript
{
  id: number (inteiro)                        // ✅ Obrigatório
}
```

**Response (Sucesso):**
```json
{}
```

---

### 3. Mensagens de Chat

#### 3.1 GET - Listar Mensagens de Chat

**Endpoint:** `chatMessages.list`  
**Tipo:** `protectedProcedure` (Query)  
**Autenticação:** ✅ Requer  
**Descrição:** Retorna todas as mensagens de chat do usuário

**Request:**
```typescript
const { data: messages } = await trpc.chatMessages.list.useQuery();
```

**Response (Sucesso):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "sender": "user",
    "text": "Olá, gostaria de sugerir uma nova métrica.",
    "timestamp": "2026-04-21T20:00:00Z"
  },
  {
    "id": 2,
    "userId": 1,
    "sender": "admin",
    "text": "Claro! Pode descrever melhor?",
    "timestamp": "2026-04-21T20:05:00Z"
  }
]
```

---

#### 3.2 POST - Adicionar Mensagem de Chat

**Endpoint:** `chatMessages.add`  
**Tipo:** `protectedProcedure` (Mutation)  
**Autenticação:** ✅ Requer  
**Descrição:** Cria uma nova mensagem de chat

**Request:**
```typescript
const mutation = trpc.chatMessages.add.useMutation();
mutation.mutate({
  sender: "user",
  text: "Olá, tenho uma dúvida sobre o dashboard."
});
```

**Validação de Entrada:**
```typescript
{
  sender: string                              // ✅ Obrigatório
  text: string                                // ✅ Obrigatório
}
```

**Response (Sucesso):**
```json
{
  "id": 3,
  "userId": 1,
  "sender": "user",
  "text": "Olá, tenho uma dúvida sobre o dashboard.",
  "timestamp": "2026-04-21T20:10:00Z"
}
```

---

### 4. Operadores

#### 4.1 GET - Listar Operadores

**Endpoint:** `operators.list`  
**Tipo:** `protectedProcedure` (Query)  
**Autenticação:** ✅ Requer  
**Descrição:** Retorna lista de todos os operadores cadastrados

**Request:**
```typescript
const { data: operators } = await trpc.operators.list.useQuery();
```

**Response (Sucesso):**
```json
[
  {
    "id": 1,
    "name": "Paulo Santana",
    "createdAt": "2026-04-21T20:00:00Z"
  },
  {
    "id": 2,
    "name": "Jessica França",
    "createdAt": "2026-04-21T20:00:00Z"
  }
]
```

---

#### 4.2 POST - Adicionar Operador

**Endpoint:** `operators.add`  
**Tipo:** `protectedProcedure` (Mutation)  
**Autenticação:** ✅ Requer  
**Descrição:** Cria um novo operador

**Request:**
```typescript
const mutation = trpc.operators.add.useMutation();
mutation.mutate({ name: "Novo Operador" });
```

**Validação de Entrada:**
```typescript
{
  name: string                                // ✅ Obrigatório (único)
}
```

**Response (Sucesso):**
```json
{
  "id": 3,
  "name": "Novo Operador",
  "createdAt": "2026-04-21T20:10:00Z"
}
```

---

### 5. Módulos

#### 5.1 GET - Listar Módulos

**Endpoint:** `modules.list`  
**Tipo:** `protectedProcedure` (Query)  
**Autenticação:** ✅ Requer  
**Descrição:** Retorna lista de todos os módulos do sistema

**Request:**
```typescript
const { data: modules } = await trpc.modules.list.useQuery();
```

**Response (Sucesso):**
```json
[
  {
    "id": 1,
    "name": "Origens de Lead",
    "createdAt": "2026-04-21T20:00:00Z"
  },
  {
    "id": 2,
    "name": "Produtos de Software",
    "createdAt": "2026-04-21T20:00:00Z"
  }
]
```

---

#### 5.2 POST - Adicionar Módulo

**Endpoint:** `modules.add`  
**Tipo:** `protectedProcedure` (Mutation)  
**Autenticação:** ✅ Requer  
**Descrição:** Cria um novo módulo

**Request:**
```typescript
const mutation = trpc.modules.add.useMutation();
mutation.mutate({ name: "Novo Módulo" });
```

**Validação de Entrada:**
```typescript
{
  name: string                                // ✅ Obrigatório (único)
}
```

**Response (Sucesso):**
```json
{
  "id": 3,
  "name": "Novo Módulo",
  "createdAt": "2026-04-21T20:10:00Z"
}
```

---

### 6. Sistema

#### 6.1 GET - Health Check

**Endpoint:** `system.health`  
**Tipo:** `publicProcedure` (Query)  
**Autenticação:** ❌ Não requer  
**Descrição:** Verifica se o sistema está operacional

**Request:**
```typescript
const { data: health } = await trpc.system.health.useQuery({ timestamp: Date.now() });
```

**Validação de Entrada:**
```typescript
{
  timestamp: number (>= 0)                    // ✅ Obrigatório
}
```

**Response (Sucesso):**
```json
{
  "ok": true
}
```

---

#### 6.2 POST - Notificar Proprietário

**Endpoint:** `system.notifyOwner`  
**Tipo:** `adminProcedure` (Mutation)  
**Autenticação:** ✅ Requer (Admin)  
**Descrição:** Envia notificação ao proprietário do sistema

**Request:**
```typescript
const mutation = trpc.system.notifyOwner.useMutation();
mutation.mutate({
  title: "Nova Venda Registada",
  content: "Paulo Santana registou uma nova venda no valor de €5000"
});
```

**Validação de Entrada:**
```typescript
{
  title: string (min: 1 caractere)            // ✅ Obrigatório
  content: string (min: 1 caractere)          // ✅ Obrigatório
}
```

**Response (Sucesso):**
```json
{
  "success": true
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Criar Registro de Dados e Notificar Admin

```typescript
// Frontend
const addMutation = trpc.operatorData.add.useMutation();
const notifyMutation = trpc.system.notifyOwner.useMutation();

const handleAddData = async () => {
  try {
    const result = await addMutation.mutateAsync({
      data: "2026-04-21",
      operador: "Paulo Santana",
      leads: 10,
      ligacoes: 5,
      atendidas: 4,
      reunioesAgendadas: 2,
      reunioesRealizadas: 1,
      vendas: 1,
      noShow: 0,
      mrr: "5000.00"
    });

    // Notificar admin
    if (result.id) {
      await notifyMutation.mutateAsync({
        title: "Novos Dados Registados",
        content: `Paulo Santana registou 10 leads e 1 venda em ${new Date().toLocaleDateString('pt-PT')}`
      });
    }
  } catch (error) {
    console.error("Erro:", error);
  }
};
```

---

### Exemplo 2: Sincronizar Dados com Webhook Externo

```typescript
// Backend - Adicionar ao routers.ts
export const appRouter = router({
  // ... routers existentes
  
  integrations: router({
    syncToWebhook: protectedProcedure
      .input(z.object({
        webhookUrl: z.string().url(),
        operatorDataId: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        // Buscar dados
        const data = await db.getOperatorDataById(input.operatorDataId);
        
        // Enviar para webhook
        const response = await fetch(input.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'operator_data.created',
            data: data,
            timestamp: new Date().toISOString()
          })
        });
        
        return { success: response.ok };
      })
  })
});
```

---

### Exemplo 3: Filtrar Dados por Data

```typescript
// Frontend
const { data: allData } = trpc.operatorData.list.useQuery();

const filteredData = allData?.filter(record => {
  const recordDate = new Date(record.data);
  const startDate = new Date('2026-04-01');
  const endDate = new Date('2026-04-30');
  
  return recordDate >= startDate && recordDate <= endDate;
}) || [];
```

---

## ⚠️ Tratamento de Erros

### Códigos de Erro tRPC

| Código | HTTP | Descrição | Solução |
|--------|------|-----------|---------|
| `UNAUTHORIZED` | 401 | Usuário não autenticado | Fazer login |
| `FORBIDDEN` | 403 | Usuário sem permissão | Requer role `admin` |
| `BAD_REQUEST` | 400 | Dados inválidos | Verificar validação Zod |
| `NOT_FOUND` | 404 | Recurso não encontrado | Verificar ID |
| `INTERNAL_SERVER_ERROR` | 500 | Erro no servidor | Contactar suporte |

### Exemplo de Tratamento de Erro

```typescript
const mutation = trpc.operatorData.add.useMutation({
  onError: (error) => {
    if (error.code === 'UNAUTHORIZED') {
      // Redirecionar para login
      window.location.href = '/login';
    } else if (error.code === 'BAD_REQUEST') {
      // Mostrar erro de validação
      console.error('Dados inválidos:', error.message);
    } else {
      // Erro genérico
      console.error('Erro:', error.message);
    }
  }
});
```

---

## 🔗 Webhooks e Integrações

### Webhooks Suportados

O sistema suporta webhooks para os seguintes eventos:

| Evento | Descrição | Payload |
|--------|-----------|---------|
| `operator_data.created` | Novo registro de dados criado | `{ id, userId, data, operador, ... }` |
| `operator_data.updated` | Registro de dados atualizado | `{ id, userId, data, operador, ... }` |
| `operator_data.deleted` | Registro de dados deletado | `{ id }` |
| `chat_message.created` | Nova mensagem de chat | `{ id, userId, sender, text, timestamp }` |

### Configurar Webhook

1. Ir para **Configurações → Integrações e Webhooks**
2. Inserir URL do webhook (ex: `https://seu-servidor.com/webhook`)
3. Sistema enviará POST para URL com payload JSON
4. Webhook deve retornar status 200-299 para confirmar recebimento

### Exemplo de Webhook Handler

```javascript
// Node.js/Express
app.post('/webhook', (req, res) => {
  const { event, data, timestamp } = req.body;
  
  console.log(`Evento recebido: ${event}`);
  console.log(`Dados:`, data);
  console.log(`Timestamp:`, timestamp);
  
  // Processar evento
  if (event === 'operator_data.created') {
    // Sincronizar com seu sistema
    syncToYourSystem(data);
  }
  
  // Confirmar recebimento
  res.status(200).json({ success: true });
});
```

---

## 📞 Suporte e Contacto

Para dúvidas sobre integração:

- **Email:** support@impacto.com
- **Documentação:** https://docs.impacto.com
- **Status do Sistema:** https://status.impacto.com

---

**Última atualização:** 21 de Abril de 2026  
**Próxima revisão:** Junho de 2026
