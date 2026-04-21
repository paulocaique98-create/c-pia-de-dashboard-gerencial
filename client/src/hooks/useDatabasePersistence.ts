import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

interface OperatorDataRecord {
  id?: number;
  data: string;
  operador: string;
  leads: number;
  ligacoes: number;
  atendidas: number;
  reunioesAgendadas: number;
  reunioesRealizadas: number;
  vendas: number;
  noShow: number;
  mrr: string;
}

interface ChatMessageRecord {
  id?: number;
  sender: string;
  text: string;
  timestamp?: string;
}

/**
 * Hook para sincronizar dados do localStorage com o banco de dados PostgreSQL
 * Carrega dados do banco ao iniciar e salva automaticamente quando há mudanças
 */
export function useDatabasePersistence() {
  const [operatorDataLoaded, setOperatorDataLoaded] = useState(false);
  const [chatMessagesLoaded, setChatMessagesLoaded] = useState(false);

  // Queries
  const { data: dbOperatorData = [] } = trpc.operatorData.list.useQuery();
  const { data: dbChatMessages = [] } = trpc.chatMessages.list.useQuery();
  const { data: dbOperators = [] } = trpc.operators.list.useQuery();
  const { data: dbModules = [] } = trpc.modules.list.useQuery();

  // Mutations
  const addOperatorDataMutation = trpc.operatorData.add.useMutation();
  const updateOperatorDataMutation = trpc.operatorData.update.useMutation();
  const deleteOperatorDataMutation = trpc.operatorData.delete.useMutation();
  const addChatMessageMutation = trpc.chatMessages.add.useMutation();
  const addOperatorMutation = trpc.operators.add.useMutation();
  const addModuleMutation = trpc.modules.add.useMutation();

  // Sincronizar dados do localStorage para o banco de dados na primeira carga
  useEffect(() => {
    if (!operatorDataLoaded && dbOperatorData.length === 0) {
      const localData = localStorage.getItem('operatorData');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          // Migrar dados do localStorage para o banco
          Object.entries(parsed).forEach(([, records]: [string, any]) => {
            if (Array.isArray(records)) {
              records.forEach((record: OperatorDataRecord) => {
                addOperatorDataMutation.mutate({
                  data: record.data,
                  operador: record.operador,
                  leads: record.leads || 0,
                  ligacoes: record.ligacoes || 0,
                  atendidas: record.atendidas || 0,
                  reunioesAgendadas: record.reunioesAgendadas || 0,
                  reunioesRealizadas: record.reunioesRealizadas || 0,
                  vendas: record.vendas || 0,
                  noShow: record.noShow || 0,
                  mrr: record.mrr || '0.00',
                });
              });
            }
          });
        } catch (error) {
          console.error('Erro ao migrar dados do localStorage:', error);
        }
      }
      setOperatorDataLoaded(true);
    }
  }, [operatorDataLoaded, dbOperatorData.length, addOperatorDataMutation]);

  // Sincronizar mensagens de chat
  useEffect(() => {
    if (!chatMessagesLoaded && dbChatMessages.length === 0) {
      const localMessages = localStorage.getItem('chatMessages');
      if (localMessages) {
        try {
          const parsed = JSON.parse(localMessages);
          if (Array.isArray(parsed)) {
            parsed.forEach((message: ChatMessageRecord) => {
              addChatMessageMutation.mutate({
                sender: message.sender,
                text: message.text,
              });
            });
          }
        } catch (error) {
          console.error('Erro ao migrar mensagens de chat:', error);
        }
      }
      setChatMessagesLoaded(true);
    }
  }, [chatMessagesLoaded, dbChatMessages.length, addChatMessageMutation]);

  // Sincronizar operadores
  useEffect(() => {
    const localOperators = localStorage.getItem('registeredOperators');
    if (localOperators && dbOperators.length === 0) {
      try {
        const parsed = JSON.parse(localOperators);
        if (Array.isArray(parsed)) {
          parsed.forEach((name: string) => {
            addOperatorMutation.mutate({ name });
          });
        }
      } catch (error) {
        console.error('Erro ao migrar operadores:', error);
      }
    }
  }, [dbOperators.length, addOperatorMutation]);

  // Sincronizar módulos
  useEffect(() => {
    const localModules = localStorage.getItem('modules');
    if (localModules && dbModules.length === 0) {
      try {
        const parsed = JSON.parse(localModules);
        if (Array.isArray(parsed)) {
          parsed.forEach((name: string) => {
            addModuleMutation.mutate({ name });
          });
        }
      } catch (error) {
        console.error('Erro ao migrar módulos:', error);
      }
    }
  }, [dbModules.length, addModuleMutation]);

  // Funções para adicionar/atualizar/deletar dados
  const addOperatorData = useCallback((data: OperatorDataRecord) => {
    return addOperatorDataMutation.mutateAsync({
      data: data.data,
      operador: data.operador,
      leads: data.leads,
      ligacoes: data.ligacoes,
      atendidas: data.atendidas,
      reunioesAgendadas: data.reunioesAgendadas,
      reunioesRealizadas: data.reunioesRealizadas,
      vendas: data.vendas,
      noShow: data.noShow,
      mrr: data.mrr,
    });
  }, [addOperatorDataMutation]);

  const updateOperatorData = useCallback((id: number, data: Partial<OperatorDataRecord>) => {
    return updateOperatorDataMutation.mutateAsync({
      id,
      data: {
        data: data.data,
        operador: data.operador,
        leads: data.leads,
        ligacoes: data.ligacoes,
        atendidas: data.atendidas,
        reunioesAgendadas: data.reunioesAgendadas,
        reunioesRealizadas: data.reunioesRealizadas,
        vendas: data.vendas,
        noShow: data.noShow,
        mrr: data.mrr,
      },
    });
  }, [updateOperatorDataMutation]);

  const deleteOperatorData = useCallback((id: number) => {
    return deleteOperatorDataMutation.mutateAsync({ id });
  }, [deleteOperatorDataMutation]);

  const addChatMessage = useCallback((message: ChatMessageRecord) => {
    return addChatMessageMutation.mutateAsync({
      sender: message.sender,
      text: message.text,
    });
  }, [addChatMessageMutation]);

  return {
    // Dados do banco
    operatorData: dbOperatorData,
    chatMessages: dbChatMessages,
    operators: dbOperators,
    modules: dbModules,
    
    // Funções de mutação
    addOperatorData,
    updateOperatorData,
    deleteOperatorData,
    addChatMessage,
    addOperator: (name: string) => addOperatorMutation.mutateAsync({ name }),
    addModule: (name: string) => addModuleMutation.mutateAsync({ name }),

    // Status de carregamento
    isLoading: addOperatorDataMutation.isPending || addChatMessageMutation.isPending,
    isError: addOperatorDataMutation.isError || addChatMessageMutation.isError,
  };
}
