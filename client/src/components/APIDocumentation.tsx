import { Download, Copy, Check, Circle } from 'lucide-react';
import { useState } from 'react';

export function APIDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const integrations = [
    { name: 'n8n', status: 'active', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { name: 'Pipedrive', status: 'active', color: 'bg-green-100 text-green-700 border-green-300' },
    { name: 'Webhook', status: 'active', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { name: 'Supabase', status: 'configured', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const downloadDocumentation = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Documentação da API - Impacto Tecnologia CRM</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 900px; margin: 0 auto; }
          h1 { color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px; margin-bottom: 20px; }
          h2 { color: #0066cc; margin-top: 30px; margin-bottom: 15px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-right: 8px; margin-bottom: 8px; }
          .badge-orange { background-color: #fed7aa; color: #92400e; }
          .badge-green { background-color: #dcfce7; color: #166534; }
          .badge-blue { background-color: #dbeafe; color: #1e40af; }
          .badge-purple { background-color: #e9d5ff; color: #6b21a8; }
          .endpoint { background-color: #f8fafc; padding: 15px; border-left: 4px solid #0066cc; margin: 15px 0; }
          .code { background-color: #1e293b; color: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; margin: 10px 0; overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f1f5f9; font-weight: bold; }
          @media print { body { margin: 0; padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📚 Documentação Completa da API</h1>
          <p>Impacto Tecnologia CRM - Integração e Desenvolvimento</p>

          <h2>Visão Geral</h2>
          <p>O Impacto Tecnologia CRM utiliza <strong>tRPC</strong> como camada de integração. Todas as operações são <strong>fortemente tipadas</strong> com TypeScript.</p>

          <h2>Status das Integrações</h2>
          <div>
            <span class="badge badge-orange">n8n - ● Ativo</span>
            <span class="badge badge-green">Pipedrive - ● Ativo</span>
            <span class="badge badge-blue">Webhook - ● Ativo</span>
            <span class="badge badge-purple">Supabase - ● Configurado</span>
          </div>

          <h2>🔐 Autenticação</h2>
          <div class="endpoint">
            <strong>publicProcedure:</strong> Acessível sem autenticação
          </div>
          <div class="endpoint">
            <strong>protectedProcedure:</strong> Requer usuário autenticado
          </div>
          <div class="endpoint">
            <strong>adminProcedure:</strong> Requer role admin
          </div>

          <h2>✅ Operações GET (Queries)</h2>
          <div class="endpoint">
            <strong>auth.me:</strong> Retorna usuário autenticado atual
            <div class="code">const user = await trpc.auth.me.useQuery();</div>
          </div>
          <div class="endpoint">
            <strong>operatorData.list:</strong> Lista todos os registros de dados de operadores
            <div class="code">const data = await trpc.operatorData.list.useQuery();</div>
          </div>
          <div class="endpoint">
            <strong>chatMessages.list:</strong> Retorna todas as mensagens de chat
          </div>
          <div class="endpoint">
            <strong>operators.list:</strong> Lista todos os operadores cadastrados
          </div>
          <div class="endpoint">
            <strong>modules.list:</strong> Lista todos os módulos do sistema
          </div>
          <div class="endpoint">
            <strong>system.health:</strong> Verifica se o sistema está operacional
          </div>

          <h2>📝 Operações POST (Mutations)</h2>
          <div class="endpoint">
            <strong>operatorData.add:</strong> Cria novo registro de dados de operador
            <div class="code">mutation.mutate({ data: "2026-04-21", operador: "Paulo", leads: 10, vendas: 1 });</div>
          </div>
          <div class="endpoint">
            <strong>chatMessages.add:</strong> Adiciona nova mensagem de chat
          </div>
          <div class="endpoint">
            <strong>operators.add:</strong> Cria novo operador
          </div>
          <div class="endpoint">
            <strong>modules.add:</strong> Cria novo módulo
          </div>
          <div class="endpoint">
            <strong>auth.logout:</strong> Encerra a sessão do usuário
          </div>
          <div class="endpoint">
            <strong>system.notifyOwner:</strong> Envia notificação ao proprietário (admin only)
          </div>

          <h2>🔄 Operações PUT/PATCH (Updates)</h2>
          <div class="endpoint">
            <strong>operatorData.update:</strong> Atualiza registro existente
            <div class="code">mutation.mutate({ id: 1, data: { leads: 15, vendas: 2 } });</div>
          </div>

          <h2>🗑️ Operações DELETE</h2>
          <div class="endpoint">
            <strong>operatorData.delete:</strong> Remove registro de dados
            <div class="code">mutation.mutate({ id: 1 });</div>
          </div>

          <h2>📊 Estrutura de Dados</h2>
          <table>
            <tr><th>Tabela</th><th>Campos</th></tr>
            <tr><td><strong>OperatorData</strong></td><td>data, operador, leads, ligacoes, atendidas, reunioesAgendadas, reunioesRealizadas, vendas, noShow, mrr</td></tr>
            <tr><td><strong>ChatMessage</strong></td><td>sender, text, timestamp</td></tr>
            <tr><td><strong>User</strong></td><td>openId, name, email, loginMethod, role, createdAt, lastSignedIn</td></tr>
          </table>

          <h2>⚠️ Tratamento de Erros</h2>
          <ul>
            <li><strong>UNAUTHORIZED:</strong> Usuário não autenticado - Fazer login</li>
            <li><strong>FORBIDDEN:</strong> Sem permissão - Requer role admin</li>
            <li><strong>BAD_REQUEST:</strong> Dados inválidos - Verificar validação</li>
          </ul>

          <h2>🔗 Webhooks Suportados</h2>
          <ul>
            <li><strong>operator_data.created</strong> - Novo registro de dados criado</li>
            <li><strong>operator_data.updated</strong> - Registro de dados atualizado</li>
            <li><strong>operator_data.deleted</strong> - Registro de dados deletado</li>
            <li><strong>chat_message.created</strong> - Nova mensagem de chat</li>
          </ul>

          <p style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
            Última atualização: 21 de Abril de 2026
          </p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const generatePDFContent = () => {
    const htmlContent = `

## Visão Geral

O Impacto Tecnologia CRM utiliza **tRPC** como camada de integração. Todas as operações são **fortemente tipadas** com TypeScript.

**Características:** Tipagem completa • Autenticação integrada • Persistência em BD • Autorização por papel

---

## Autenticação

### publicProcedure
Acessível sem autenticação. Exemplo: system.health

### protectedProcedure
Requer usuário autenticado. Exemplo: operatorData.list, chatMessages.add

### adminProcedure
Requer role admin. Exemplo: system.notifyOwner

---

## Operações GET (Queries)

### auth.me
Retorna usuário autenticado atual
\`\`\`javascript
const user = await trpc.auth.me.useQuery();
\`\`\`

### operatorData.list
Lista todos os registros de dados de operadores do usuário
\`\`\`javascript
const data = await trpc.operatorData.list.useQuery();
\`\`\`

### chatMessages.list
Retorna todas as mensagens de chat do usuário

### operators.list
Lista todos os operadores cadastrados

### modules.list
Lista todos os módulos do sistema

### system.health
Verifica se o sistema está operacional (sem autenticação)

---

## Operações POST (Mutations)

### operatorData.add
Cria novo registro de dados de operador
\`\`\`javascript
mutation.mutate({
  data: "2026-04-21",
  operador: "Paulo",
  leads: 10, vendas: 1
});
\`\`\`

### chatMessages.add
Adiciona nova mensagem de chat

### operators.add
Cria novo operador

### modules.add
Cria novo módulo

### auth.logout
Encerra a sessão do usuário

### system.notifyOwner
Envia notificação ao proprietário (admin only)

---

## Operações PUT/PATCH (Updates)

### operatorData.update
Atualiza registro existente de dados de operador
\`\`\`javascript
mutation.mutate({
  id: 1,
  data: { leads: 15, vendas: 2 }
});
\`\`\`

---

## Operações DELETE

### operatorData.delete
Remove registro de dados de operador
\`\`\`javascript
mutation.mutate({ id: 1 });
\`\`\`

---

## Estrutura de Dados

### OperatorData
data, operador, leads, ligacoes, atendidas, reunioesAgendadas, reunioesRealizadas, vendas, noShow, mrr

### ChatMessage
sender, text, timestamp

### User
openId, name, email, loginMethod, role, createdAt, lastSignedIn

---

## Tratamento de Erros

- **UNAUTHORIZED**: Usuário não autenticado - Fazer login
- **FORBIDDEN**: Sem permissão - Requer role admin
- **BAD_REQUEST**: Dados inválidos - Verificar validação

---

## Webhooks Suportados

- **operator_data.created** - Novo registro de dados criado
- **operator_data.updated** - Registro de dados atualizado
- **operator_data.deleted** - Registro de dados deletado
- **chat_message.created** - Nova mensagem de chat

---

Última atualização: 21 de Abril de 2026`;
  };

  const CodeBlock = ({ code, language = 'javascript' }: { code: string; language?: string }) => (
    <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs overflow-x-auto flex justify-between items-start gap-2">
      <pre className="flex-1 overflow-x-auto">{code}</pre>
      <button
        onClick={() => copyToClipboard(code)}
        className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded shrink-0 flex items-center gap-1 transition-colors"
        title="Copiar código"
      >
        {copiedCode === code ? <Check size={14} /> : <Copy size={14} />}
        {copiedCode === code ? 'Copiado!' : 'Copiar'}
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in max-h-[calc(100vh-300px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 mb-1 text-lg">📚 Documentação Completa da API</h3>
          <p className="text-sm text-slate-600">Todos os endpoints, estrutura de dados, exemplos e tratamento de erros</p>
        </div>
        <button
          onClick={downloadDocumentation}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm shrink-0"
        >
          <Download size={16} /> Download
        </button>
      </div>

      {/* Status das Integrações */}
      <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
        <h4 className="font-bold text-slate-800 text-sm mb-3">🔌 Status das Integrações</h4>
        <div className="flex flex-wrap gap-2">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${integration.color} transition-all`}
            >
              <Circle size={8} className="fill-current" />
              {integration.name}
              <span className="text-[10px] opacity-75">
                {integration.status === 'active' ? '● Ativo' : '● Configurado'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card: Visão Geral */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-blue-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            🔍
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-2">Visão Geral</h4>
            <p className="text-sm text-slate-600 mb-3">
              O Impacto Tecnologia CRM utiliza <strong>tRPC</strong> como camada de integração. Todas as operações são
              <strong> fortemente tipadas</strong> com TypeScript.
            </p>
            <p className="text-xs text-slate-500">
              <strong>Características:</strong> Tipagem completa • Autenticação integrada • Persistência em BD • Autorização por papel
            </p>
          </div>
        </div>
      </div>

      {/* Card: Autenticação */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-purple-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            🔐
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Autenticação</h4>
            <div className="space-y-2">
              <div className="text-xs">
                <p className="font-bold text-slate-800">publicProcedure</p>
                <p className="text-slate-600">Acessível sem autenticação. Exemplo: system.health</p>
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">protectedProcedure</p>
                <p className="text-slate-600">Requer usuário autenticado. Exemplo: operatorData.list, chatMessages.add</p>
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">adminProcedure</p>
                <p className="text-slate-600">Requer role admin. Exemplo: system.notifyOwner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Operações GET */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-green-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            ✅
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Operações GET (Queries)</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-mono font-bold text-green-700">auth.me</p>
                <p className="text-xs text-slate-600 mt-1">Retorna usuário autenticado atual</p>
                <CodeBlock code="const user = await trpc.auth.me.useQuery();" />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-green-700">operatorData.list</p>
                <p className="text-xs text-slate-600 mt-1">Lista todos os registros de dados de operadores do usuário</p>
                <CodeBlock code="const data = await trpc.operatorData.list.useQuery();" />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-green-700">chatMessages.list</p>
                <p className="text-xs text-slate-600 mt-1">Retorna todas as mensagens de chat do usuário</p>
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-green-700">operators.list</p>
                <p className="text-xs text-slate-600 mt-1">Lista todos os operadores cadastrados</p>
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-green-700">modules.list</p>
                <p className="text-xs text-slate-600 mt-1">Lista todos os módulos do sistema</p>
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-green-700">system.health</p>
                <p className="text-xs text-slate-600 mt-1">Verifica se o sistema está operacional (sem autenticação)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Operações POST */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-blue-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            📝
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Operações POST (Mutations)</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-mono font-bold text-blue-700">operatorData.add</p>
                <p className="text-xs text-slate-600 mt-1">Cria novo registro de dados de operador</p>
                <CodeBlock
                  code={`mutation.mutate({
  data: "2026-04-21",
  operador: "Paulo",
  leads: 10, vendas: 1
});`}
                />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-blue-700">chatMessages.add</p>
                <p className="text-xs text-slate-600 mt-1">Adiciona nova mensagem de chat</p>
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-blue-700">operators.add</p>
                <p className="text-xs text-slate-600 mt-1">Cria novo operador</p>
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-blue-700">modules.add</p>
                <p className="text-xs text-slate-600 mt-1">Cria novo módulo</p>
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-blue-700">auth.logout</p>
                <p className="text-xs text-slate-600 mt-1">Encerra a sessão do usuário</p>
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-blue-700">system.notifyOwner</p>
                <p className="text-xs text-slate-600 mt-1">Envia notificação ao proprietário (admin only)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Operações PUT/PATCH */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-yellow-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
            🔄
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Operações PUT/PATCH (Updates)</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-mono font-bold text-yellow-700">operatorData.update</p>
                <p className="text-xs text-slate-600 mt-1">Atualiza registro existente de dados de operador</p>
                <CodeBlock
                  code={`mutation.mutate({
  id: 1,
  data: { leads: 15, vendas: 2 }
});`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Operações DELETE */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-red-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
            🗑️
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Operações DELETE</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-mono font-bold text-red-700">operatorData.delete</p>
                <p className="text-xs text-slate-600 mt-1">Remove registro de dados de operador</p>
                <CodeBlock code={`mutation.mutate({ id: 1 });`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Estrutura de Dados */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-indigo-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            📊
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Estrutura de Dados</h4>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-bold text-slate-800">OperatorData</p>
                <p className="text-slate-600">data, operador, leads, ligacoes, atendidas, reunioesAgendadas, reunioesRealizadas, vendas, noShow, mrr</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">ChatMessage</p>
                <p className="text-slate-600">sender, text, timestamp</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">User</p>
                <p className="text-slate-600">openId, name, email, loginMethod, role, createdAt, lastSignedIn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Tratamento de Erros */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-orange-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            ⚠️
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Tratamento de Erros</h4>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="font-bold text-red-600 min-w-max">UNAUTHORIZED:</span>
                <span className="text-slate-600">Usuário não autenticado - Fazer login</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-red-600 min-w-max">FORBIDDEN:</span>
                <span className="text-slate-600">Sem permissão - Requer role admin</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-red-600 min-w-max">BAD_REQUEST:</span>
                <span className="text-slate-600">Dados inválidos - Verificar validação</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Webhooks */}
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-cyan-300 transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center shrink-0">
            🔗
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-slate-800 text-lg mb-3">Webhooks Suportados</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-600">
                <strong>operator_data.created</strong> - Novo registro de dados criado
              </p>
              <p className="text-slate-600">
                <strong>operator_data.updated</strong> - Registro de dados atualizado
              </p>
              <p className="text-slate-600">
                <strong>operator_data.deleted</strong> - Registro de dados deletado
              </p>
              <p className="text-slate-600">
                <strong>chat_message.created</strong> - Nova mensagem de chat
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center py-4 border-t border-slate-200">
        Última atualização: 21 de Abril de 2026 • Para mais detalhes, baixe a documentação completa em Markdown
      </div>
    </div>
  );
}
