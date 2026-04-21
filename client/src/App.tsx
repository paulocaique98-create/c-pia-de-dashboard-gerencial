// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  TrendingUp,
  TrendingDown,
  Target,
  Users, 
  DollarSign, 
  Activity,
  AlertCircle,
  Menu,
  X,
  PhoneCall,
  CalendarCheck,
  PhoneIncoming,
  CheckCircle,
  UserX,
  Pencil,
  Trash2,
  UserPlus,
  ListPlus,
  CalendarDays,
  Filter, 
  BarChart2, 
  FolderPlus,
  Shield,
  Settings as SettingsIcon,
  MessageSquare,
  Send,
  Camera,
  User,
  Lock,
  Download,
  Plug,
  Link2,
  Webhook
} from 'lucide-react';

// --- COMPONENTES AUXILIARES ---
const APIDocumentation = () => (
  <div className="p-6 animate-fade-in">
    <h3 className="text-lg font-bold text-slate-800 mb-4">Documentação da API</h3>
    <p className="text-sm text-slate-500 mb-6">Aqui você encontra as instruções para integrar o Impacto CRM com os seus sistemas via API REST.</p>
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
      <p className="font-mono text-sm text-slate-700">Endpoint Base: <span className="font-bold text-blue-600">https://api.impactocrm.com/v1</span></p>
      <p className="text-xs text-slate-500 mt-2">A documentação interativa completa será disponibilizada na próxima atualização.</p>
    </div>
  </div>
);

// --- COMPONENTE TOAST ---
const Toast = ({ id, message, type, onClose, actions }) => {
  useEffect(() => {
    if (type !== 'confirm' && type !== 'action') {
      const timer = setTimeout(() => onClose(id), 4000);
      return () => clearTimeout(timer);
    }
  }, [id, onClose, type]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : type === 'error' ? 'bg-red-50 border-red-200' : type === 'warning' ? 'bg-yellow-50 border-yellow-200' : type === 'confirm' ? 'bg-purple-50 border-purple-200' : type === 'action' ? 'bg-indigo-50 border-indigo-200' : 'bg-blue-50 border-blue-200';
  const textColor = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : type === 'warning' ? 'text-yellow-800' : type === 'confirm' ? 'text-purple-800' : type === 'action' ? 'text-indigo-800' : 'text-blue-800';
  const iconColor = type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : type === 'warning' ? 'text-yellow-600' : type === 'confirm' ? 'text-purple-600' : type === 'action' ? 'text-indigo-600' : 'text-blue-600';
  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? XCircle : type === 'warning' ? AlertCircle : type === 'confirm' ? AlertCircle : type === 'action' ? Info : Info;

  const isInteractive = type === 'confirm' || type === 'action';

  return (
    <div className={`${bgColor} border rounded-lg p-4 flex flex-col gap-3 animate-slide-in shadow-lg max-w-sm`}>
      <div className="flex items-start gap-3">
        <Icon className={`${iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
        <p className={`${textColor} font-medium text-sm flex-1`}>{message}</p>
        {!isInteractive && (
          <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {isInteractive && actions && (
        <div className="flex gap-2 ml-8">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                action.onClick();
                onClose(id);
              }}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                action.variant === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : action.variant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ToastContainer = ({ toasts, onClose }) => (
  <div className="fixed bottom-4 right-4 space-y-3 z-50 pointer-events-auto">
    {toasts.map(toast => (
      <Toast key={toast.id} {...toast} onClose={onClose} />
    ))}
  </div>
);

// --- COMPONENTE DE CARREGAMENTO ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full animate-fade-in">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
      </div>
      <p className="text-slate-600 font-medium">Carregando dados...</p>
    </div>
  </div>
);

// --- COMPONENTE DA LOGO: IMPACTO TECNOLOGIA ---
const ImpactoLogo = ({ className = "w-8 h-8" }) => (
  <img 
    src="/impactotecnologiabr_logo.jpg" 
    alt="Impacto Tecnologia" 
    className={`${className} object-contain rounded-md shadow-sm`}
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "https://ui-avatars.com/api/?name=Impacto+Tecnologia&background=0052cc&color=fff&size=128&rounded=true";
    }}
  />
);

// --- MOCK DATA INICIAL ---
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-12
const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

const formatMonth = (m: number) => m.toString().padStart(2, '0');

const initialOperatorData: any[] = [];

const initialRegisteredOperators = [
  { id: '1', name: 'Paulo Santana', status: 'ativo' },
  { id: '2', name: 'Jessica França', status: 'ativo' },
  { id: '3', name: 'Rafael Lima', status: 'ativo' },
  { id: '4', name: 'Natanael Barcelos', status: 'ativo' },
  { id: '5', name: 'André Moraes', status: 'ativo' }
];

const initialSystemUsers = [
  { id: '1', username: 'paulo.santana', password: '123456', role: 'ADMIN', name: 'Paulo Santana', photo: '' },
  { id: '2', username: 'joao.silva', password: '123456', role: 'USER', name: 'João Silva', photo: '' },
  { id: '3', username: 'vitor.paula', password: '123456', role: 'USER', name: 'Vitor Paula', photo: '' },
  { id: '4', username: 'marcell.vianna', password: '123456', role: 'USER', name: 'Marcell Vianna', photo: '' }
];

const initialSystemModules = ['Origens de Lead', 'Produtos de Software', 'Tags de Cliente'];

const initialMetas = { vendas: 0, mrr: 0, conversao: 0 };

const initialChatMessages = [
  { id: 'm1', userId: '2', sender: 'user', text: 'Olá, gostaria de sugerir uma nova métrica no dashboard.', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'm2', userId: '2', sender: 'admin', text: 'Olá! Claro, pode descrever melhor qual seria a métrica?', timestamp: new Date(Date.now() - 80000000).toISOString() }
];

// ==========================================
// VIEWS 
// ==========================================

function DashboardView({ operatorData, registeredOperators, metas }: any) {
  const maxDateStr = operatorData.length > 0
    ? operatorData.reduce((max, p) => p.data > max ? p.data : max, operatorData[0].data)
    : new Date().toISOString().split('T')[0];

  const defaultStart = maxDateStr.substring(0, 8) + '01';

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(maxDateStr);
  const [selectedOperator, setSelectedOperator] = useState('');

  // --- FILTROS INTELIGENTES (Quick Filters) ---
  const getToday = () => new Date().toISOString().split('T')[0];
  const getDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  };

  const setQuickFilter = (type) => {
    setEndDate(getToday());
    if (type === 'hoje') setStartDate(getToday());
    else if (type === '7dias') setStartDate(getDaysAgo(7));
    else if (type === 'mes') setStartDate(getFirstDayOfMonth());
  };
  // --------------------------------------------

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    if (val > endDate) setEndDate(val);
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    setEndDate(val);
    if (val < startDate) setStartDate(val);
  };

  // --- CÁLCULO DO PERÍODO ANTERIOR (Crescimento) ---
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - diffDays);

  const prevStartDateStr = prevStart.toISOString().split('T')[0];
  const prevEndDateStr = prevEnd.toISOString().split('T')[0];

  const prevFilteredData = operatorData.filter(d => {
    const matchOp = selectedOperator === '' || d.operador === selectedOperator;
    const matchDate = d.data >= prevStartDateStr && d.data <= prevEndDateStr;
    return matchOp && matchDate;
  });

  const prevTotals = {
    leads: prevFilteredData.reduce((acc, op) => acc + Number(op.leads || 0), 0),
    ligacoes: prevFilteredData.reduce((acc, op) => acc + Number(op.ligacoes || 0), 0),
    atendidas: prevFilteredData.reduce((acc, op) => acc + Number(op.atendidas || 0), 0),
    reunioesAgendadas: prevFilteredData.reduce((acc, op) => acc + Number(op.reunioesAgendadas || 0), 0),
    reunioesRealizadas: prevFilteredData.reduce((acc, op) => acc + Number(op.reunioesRealizadas || 0), 0),
    noShow: prevFilteredData.reduce((acc, op) => acc + Number(op.noShow || 0), 0),
    vendas: prevFilteredData.reduce((acc, op) => acc + Number(op.vendas || 0), 0),
    mrr: prevFilteredData.reduce((acc, op) => acc + Number(op.mrr || 0), 0),
  };

  const calcGrowth = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };
  // ------------------------------------------------

  const filteredData = operatorData.filter(d => {
    const matchOp = selectedOperator === '' || d.operador === selectedOperator;
    const matchDate = d.data >= startDate && d.data <= endDate;
    return matchOp && matchDate;
  });

  const totalLeads = filteredData.reduce((acc, op) => acc + Number(op.leads || 0), 0);
  const totalLigacoes = filteredData.reduce((acc, op) => acc + Number(op.ligacoes || 0), 0);
  const totalAtendidas = filteredData.reduce((acc, op) => acc + Number(op.atendidas || 0), 0);
  const totalReunioesAgendadas = filteredData.reduce((acc, op) => acc + Number(op.reunioesAgendadas || 0), 0);
  const totalReunioesRealizadas = filteredData.reduce((acc, op) => acc + Number(op.reunioesRealizadas || 0), 0);
  const totalNoShow = filteredData.reduce((acc, op) => acc + Number(op.noShow || 0), 0);
  const totalVendas = filteredData.reduce((acc, op) => acc + Number(op.vendas || 0), 0);
  const totalMRR = filteredData.reduce((acc, op) => acc + Number(op.mrr || 0), 0);

  const dynamicMetrics = [
    { id: 1, title: 'Leads Entregues', value: totalLeads, growth: calcGrowth(totalLeads, prevTotals.leads), type: 'number', icon: <Users className="text-blue-500" size={24} /> },
    { id: 2, title: 'Ligações Realizadas', value: totalLigacoes, growth: calcGrowth(totalLigacoes, prevTotals.ligacoes), type: 'number', icon: <PhoneCall className="text-purple-500" size={24} /> },
    { id: 3, title: 'Atendidas', value: totalAtendidas, growth: calcGrowth(totalAtendidas, prevTotals.atendidas), type: 'number', icon: <PhoneIncoming className="text-indigo-500" size={24} /> },
    { id: 4, title: 'Reuniões Agendadas', value: totalReunioesAgendadas, growth: calcGrowth(totalReunioesAgendadas, prevTotals.reunioesAgendadas), type: 'number', icon: <CalendarCheck className="text-orange-500" size={24} /> },
    { id: 5, title: 'Reuniões Realizadas', value: totalReunioesRealizadas, growth: calcGrowth(totalReunioesRealizadas, prevTotals.reunioesRealizadas), type: 'number', icon: <CheckCircle className="text-emerald-500" size={24} /> },
    { id: 6, title: 'No-Show', value: totalNoShow, growth: calcGrowth(totalNoShow, prevTotals.noShow), type: 'number', icon: <UserX className="text-red-500" size={24} /> },
    { id: 7, title: 'Vendas Realizadas', value: totalVendas, growth: calcGrowth(totalVendas, prevTotals.vendas), type: 'number', icon: <TrendingUp className="text-blue-500" size={24} /> },
    { id: 8, title: 'MRR Total', value: totalMRR, growth: calcGrowth(totalMRR, prevTotals.mrr), type: 'currency', icon: <DollarSign className="text-emerald-500" size={24} /> },
  ];

  const formatValue = (value, type) => {
    if (type === 'currency') return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return value.toLocaleString('pt-BR');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 truncate">Dashboard Gerencial</h1>
        <p className="text-slate-500 text-sm mt-0.5">Acompanhamento consolidado do desempenho da equipe.</p>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200/80 w-full transition-all hover:shadow-md mb-6">
        
        {/* Quick Filters */}
        <div className="flex gap-2 w-full xl:w-auto overflow-x-auto custom-scrollbar pb-1 xl:pb-0 shrink-0">
          <button onClick={() => setQuickFilter('hoje')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Hoje</button>
          <button onClick={() => setQuickFilter('7dias')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Últimos 7 Dias</button>
          <button onClick={() => setQuickFilter('mes')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Este Mês</button>
        </div>

        <div className="hidden xl:block w-px h-10 bg-slate-200 mx-2"></div>

        {/* Date & Operator */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center w-full sm:w-auto gap-2">
            <div className="relative group flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDays size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <input type="date" value={startDate} max={maxDateStr} onChange={handleStartDateChange} className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition-all cursor-pointer outline-none shadow-sm"/>
            </div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0">até</span>
            <div className="relative group flex-1 sm:flex-none">
              <input type="date" value={endDate} max={maxDateStr} onChange={handleEndDateChange} className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition-all cursor-pointer outline-none shadow-sm"/>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1"></div>
          <div className="relative w-full sm:w-auto group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)} className="w-full sm:w-56 pl-9 pr-8 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition-all cursor-pointer appearance-none outline-none shadow-sm">
              <option value="">Todos os Operadores</option>
              {registeredOperators.map(op => <option key={op.id} value={op.name}>{op.name}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {dynamicMetrics.map((metric) => (
          <div key={metric.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 cursor-default">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">{formatValue(metric.value, metric.type)}</h3>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-blue-50 group-hover:shadow-sm">
                {metric.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400 truncate text-xs">
                {selectedOperator ? selectedOperator : 'Toda a Equipe'}
              </span>
              
              {/* Badge de Crescimento */}
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${metric.growth > 0 ? 'bg-emerald-100 text-emerald-700' : metric.growth < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`} title="Comparado ao período anterior equivalente">
                {metric.growth > 0 ? <TrendingUp size={12} /> : metric.growth < 0 ? <TrendingDown size={12} /> : null}
                {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- NOVA VIEW: ACOMPANHAMENTO DE METAS ---
function MetasTrackingView({ operatorData, registeredOperators, metas }) {
  const [activeTab, setActiveTab] = useState('globais');
  const [selectedOperatorForGoals, setSelectedOperatorForGoals] = useState(null);
  
  // FIX 4: JSON.parse Try/Catch para individualGoals
  const [individualGoals, setIndividualGoals] = useState(() => {
    try {
      const stored = localStorage.getItem('individualGoals');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Erro ao fazer parse de individualGoals:", error);
      return {};
    }
  });
  
  // FIX 4: JSON.parse Try/Catch para goalsHistory
  const [goalsHistory, setGoalsHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('goalsHistory');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Erro ao fazer parse de goalsHistory:", error);
      return {};
    }
  });
  
  const maxDateStr = operatorData.length > 0
    ? operatorData.reduce((max, p) => p.data > max ? p.data : max, operatorData[0].data)
    : new Date().toISOString().split('T')[0];

  const defaultStart = maxDateStr.substring(0, 8) + '01';

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(maxDateStr);
  const [selectedOperator, setSelectedOperator] = useState('');

  // --- FILTROS INTELIGENTES (Quick Filters) ---
  const getToday = () => new Date().toISOString().split('T')[0];
  const getDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  };

  const setQuickFilter = (type) => {
    setEndDate(getToday());
    if (type === 'hoje') setStartDate(getToday());
    else if (type === '7dias') setStartDate(getDaysAgo(7));
    else if (type === 'mes') setStartDate(getFirstDayOfMonth());
  };
  // --------------------------------------------

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    if (val > endDate) setEndDate(val);
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    setEndDate(val);
    if (val < startDate) setStartDate(val);
  };

  const filteredData = operatorData.filter(d => {
    const matchOp = selectedOperator === '' || d.operador === selectedOperator;
    const matchDate = d.data >= startDate && d.data <= endDate;
    return matchOp && matchDate;
  });

  const totalLeads = filteredData.reduce((acc, op) => acc + Number(op.leads || 0), 0);
  const totalVendas = filteredData.reduce((acc, op) => acc + Number(op.vendas || 0), 0);
  const totalMRR = filteredData.reduce((acc, op) => acc + Number(op.mrr || 0), 0);
  const taxaConversaoAtual = totalLeads > 0 ? (totalVendas / totalLeads) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 truncate">
          <Target className="text-blue-600 shrink-0" /> Acompanhamento de Metas
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Acompanhe o progresso das metas globais.</p>
      </div>

      {/* Tabs desativados - apenas Metas Globais visível por enquanto */}
      {/* Metas Individuais será reativada em breve */}

      {/* SEÇÃO: METAS GLOBAIS - Única seção ativa */}
      {true && (
        <>
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200/80 w-full transition-all hover:shadow-md mb-6">
            
            {/* Quick Filters */}
            <div className="flex gap-2 w-full xl:w-auto overflow-x-auto custom-scrollbar pb-1 xl:pb-0 shrink-0">
              <button onClick={() => setQuickFilter('hoje')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Hoje</button>
              <button onClick={() => setQuickFilter('7dias')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Últimos 7 Dias</button>
              <button onClick={() => setQuickFilter('mes')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Este Mês</button>
            </div>

            <div className="hidden xl:block w-px h-10 bg-slate-200 mx-2"></div>

            {/* Date & Operator */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center w-full sm:w-auto gap-2">
                <div className="relative group flex-1 sm:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarDays size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input type="date" value={startDate} max={maxDateStr} onChange={handleStartDateChange} className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition-all cursor-pointer outline-none shadow-sm"/>
                </div>
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0">até</span>
                <div className="relative group flex-1 sm:flex-none">
                  <input type="date" value={endDate} max={maxDateStr} onChange={handleEndDateChange} className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition-all cursor-pointer outline-none shadow-sm"/>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1"></div>
              <div className="relative w-full sm:w-auto group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)} className="w-full sm:w-56 pl-9 pr-8 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition-all cursor-pointer appearance-none outline-none shadow-sm">
                  <option value="">Todos os Operadores</option>
                  {registeredOperators.map(op => <option key={op.id} value={op.name}>{op.name}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

            {/* Progresso de Metas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vendas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Meta de Vendas</span>
              <p className="text-xs text-slate-400 mt-1">Acumulado do período</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black text-blue-600">{totalVendas}</span>
            <span className="text-lg font-semibold text-slate-400 mb-1">/ {metas.vendas}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden shadow-inner relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((totalVendas / metas.vendas) * 100, 100)}%` }}></div>
          </div>
              <p className="text-sm font-bold text-slate-500 text-right">{((totalVendas / metas.vendas) * 100).toFixed(1)}% alcançado</p>
            </div>

            {/* MRR */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">MRR Novo</span>
              <p className="text-xs text-slate-400 mt-1">Receita recorrente gerada</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="flex items-end gap-2 mb-4">
            {/* FIX 6: Formatação de Moeda consistente */}
            <span className="text-4xl font-black text-emerald-600"><span className="text-xl font-bold mr-1">R$</span>{totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-lg font-semibold text-slate-400 mb-1">/ {(metas.mrr / 1000)}k</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden shadow-inner relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((totalMRR / metas.mrr) * 100, 100)}%` }}></div>
          </div>
              <p className="text-sm font-bold text-slate-500 text-right">{((totalMRR / metas.mrr) * 100).toFixed(1)}% alcançado</p>
            </div>

            {/* Conversão */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Conversão</span>
              <p className="text-xs text-slate-400 mt-1">Taxa de Leads p/ Vendas</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Filter className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black text-purple-600">{taxaConversaoAtual.toFixed(1)}%</span>
            <span className="text-lg font-semibold text-slate-400 mb-1">/ {metas.conversao}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden shadow-inner relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((taxaConversaoAtual / metas.conversao) * 100, 100)}%` }}></div>
          </div>
              <p className="text-sm font-bold text-slate-500 text-right">{((taxaConversaoAtual / metas.conversao) * 100).toFixed(1)}% da meta</p>
            </div>
          </div>
        </>
      )}

      {/* SEÇÃO: METAS INDIVIDUAIS - DESATIVADO POR ENQUANTO */}
      {false && activeTab === 'individuais' && (
        <div className="space-y-6" key={`individuais-${Object.keys(goalsHistory).length}`}>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Metas Individuais por Operador</h3>
            <p className="text-sm text-slate-500">Clique em um operador para visualizar suas metas salvas anteriormente.</p>
          </div>
          
          {/* Grid de Operadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredOperators && registeredOperators.filter((op) => op && op.status === 'ativo').map((op) => {
              const hasGoals = Object.keys(goalsHistory).some((key) => key.startsWith(op.id));
              return (
                <button
                  key={op.id}
                  onClick={() => {
                    setSelectedOperatorForGoals(op);
                    // Reload goals from localStorage when opening modal (FIX 4 applied here)
                    try {
                      const stored = localStorage.getItem('goalsHistory');
                      if (stored) setGoalsHistory(JSON.parse(stored));
                    } catch (e) {
                      setGoalsHistory({});
                    }
                  }}
                  className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{op.name}</p>
                      {hasGoals && <p className="text-xs text-green-600 mt-1 font-medium">✓ Metas Definidas</p>}
                      {!hasGoals && <p className="text-xs text-slate-400 mt-1">Sem metas</p>}
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <Users size={20} className="text-blue-600" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Modal de Metas do Operador */}
          {selectedOperatorForGoals && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Metas de {selectedOperatorForGoals.name}</h2>
                  <button onClick={() => setSelectedOperatorForGoals(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={24} className="text-slate-600" />
                  </button>
                </div>
                
                <p className="text-sm text-slate-500 mb-6">Histórico de metas salvas para este operador. As metas são organizadas por mês.</p>
                
                {/* Metas salvas do operador */}
                <div className="space-y-4">
                  {Object.keys(goalsHistory).filter(key => key.startsWith(selectedOperatorForGoals.id)).length > 0 ? (
                    Object.keys(goalsHistory)
                      .filter(key => key.startsWith(selectedOperatorForGoals.id))
                      .sort()
                      .reverse()
                      .map(key => {
                        const entries = goalsHistory[key] || [];
                        return (
                          <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="text-sm font-semibold text-slate-700 mb-3">Mês: {key.split('-')[1]}</p>
                            {entries.map((entry, idx) => (
                              <div key={idx} className="p-3 bg-white rounded border border-slate-200 mb-2">
                                <p className="text-xs text-slate-500 mb-2">Entrada #{entries.length - idx} - {new Date(entry.savedAt).toLocaleString('pt-BR')} por {entry.savedBy}</p>
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-semibold text-slate-600">Leads Entregues</span>
                                      <span className="text-xs font-bold text-slate-900">{entry.leadsEntregues}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((entry.leadsEntregues / 100) * 100, 100)}%` }}></div>
                                      </div>
                                      <span className="text-xs font-bold text-blue-600 w-10 text-right">{Math.min(Math.round((entry.leadsEntregues / 100) * 100), 100)}%</span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-semibold text-slate-600">Reuniões Realizadas</span>
                                      <span className="text-xs font-bold text-slate-900">{entry.reunioesRealizadas}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((entry.reunioesRealizadas / 50) * 100, 100)}%` }}></div>
                                      </div>
                                      <span className="text-xs font-bold text-emerald-600 w-10 text-right">{Math.min(Math.round((entry.reunioesRealizadas / 50) * 100), 100)}%</span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-semibold text-slate-600">Taxa de Conexão</span>
                                      <span className="text-xs font-bold text-slate-900">{entry.taxaConexao}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-amber-500 h-2 rounded-full transition-all duration-300" style={{ width: `${entry.taxaConexao}%` }}></div>
                                      </div>
                                      <span className="text-xs font-bold text-amber-600 w-10 text-right">{entry.taxaConexao}%</span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-semibold text-slate-600">Taxa de Conversão</span>
                                      <span className="text-xs font-bold text-slate-900">{entry.taxaConversao}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${entry.taxaConversao}%` }}></div>
                                      </div>
                                      <span className="text-xs font-bold text-purple-600 w-10 text-right">{entry.taxaConversao}%</span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-semibold text-slate-600">Ligações Diárias</span>
                                      <span className="text-xs font-bold text-slate-900">{entry.ligacoesDiarias}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-rose-500 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((entry.ligacoesDiarias / 30) * 100, 100)}%` }}></div>
                                      </div>
                                      <span className="text-xs font-bold text-rose-600 w-10 text-right">{Math.min(Math.round((entry.ligacoesDiarias / 30) * 100), 100)}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                      <p className="text-slate-600">Nenhuma meta salva para este operador.</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 justify-end mt-6 border-t pt-6">
                  <button onClick={() => setSelectedOperatorForGoals(null)} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DailyPerformanceView({ operatorData, registeredOperators }) {
  const maxDateStr = operatorData.length > 0 ? operatorData.reduce((max, p) => p.data > max ? p.data : max, operatorData[0].data) : new Date().toISOString().split('T')[0];
  const defaultStart = maxDateStr.substring(0, 8) + '01';
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(maxDateStr);
  const [selectedOperator, setSelectedOperator] = useState('');

  // --- FILTROS INTELIGENTES (Quick Filters) ---
  const getToday = () => new Date().toISOString().split('T')[0];
  const getDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  };

  const setQuickFilter = (type) => {
    setEndDate(getToday());
    if (type === 'hoje') setStartDate(getToday());
    else if (type === '7dias') setStartDate(getDaysAgo(7));
    else if (type === 'mes') setStartDate(getFirstDayOfMonth());
  };
  // --------------------------------------------

  const chartMetricsConfig = [
    { key: 'leads', label: 'Leads Entregues' }, { key: 'ligacoes', label: 'Ligações Realizadas' },
    { key: 'atendidas', label: 'Atendidas' }, { key: 'reunioesAgendadas', label: 'Reuniões Agendadas' },
    { key: 'reunioesRealizadas', label: 'Reuniões Realizadas' }, { key: 'noShow', label: 'No-Show' },
    { key: 'vendas', label: 'Vendas Realizadas' }
  ];
  const [activeChartMetric, setChartMetric] = useState('vendas');

  const getChartData = () => {
    if (!startDate || !endDate) return [];
    const opData = operatorData.filter(op => selectedOperator === '' || op.operador === selectedOperator);
    const daysMap = {};
    let curr = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    let daysCount = 0;
    while (curr <= end && daysCount < 366) {
      const dateStr = curr.toISOString().split('T')[0];
      const day = curr.getDate();
      const month = curr.getMonth() + 1;
      const prevCurr = new Date(curr);
      prevCurr.setMonth(prevCurr.getMonth() - 1);
      const prevDateStr = prevCurr.toISOString().split('T')[0];
      let currentValue = 0;
      let previousValue = 0;
      opData.forEach(d => {
        if (d.data === dateStr) currentValue += Number(d[activeChartMetric] || 0);
        if (d.data === prevDateStr) previousValue += Number(d[activeChartMetric] || 0);
      });
      if (currentValue > 0 || previousValue > 0) {
        daysMap[dateStr] = { label: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`, current: currentValue, previous: previousValue };
      }
      curr.setDate(curr.getDate() + 1);
      daysCount++;
    }
    return Object.values(daysMap);
  };

  const chartData = getChartData();
  const maxChartValue = chartData.length > 0 ? Math.max(...chartData.map(d => Math.max(d.current, d.previous))) : 0;
  const activeMetricLabel = chartMetricsConfig.find(m => m.key === activeChartMetric)?.label || 'Vendas';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 truncate"><BarChart2 className="text-blue-600 shrink-0" /> Desempenho Diário</h1>
        <p className="text-slate-500 text-sm mt-0.5">Comparativo diário detalhado das métricas de vendas.</p>
      </div>
      
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200/80 w-full transition-all hover:shadow-md mb-6">
        {/* Quick Filters */}
        <div className="flex gap-2 w-full xl:w-auto overflow-x-auto custom-scrollbar pb-1 xl:pb-0 shrink-0">
          <button onClick={() => setQuickFilter('hoje')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Hoje</button>
          <button onClick={() => setQuickFilter('7dias')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Últimos 7 Dias</button>
          <button onClick={() => setQuickFilter('mes')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Este Mês</button>
        </div>

        <div className="hidden xl:block w-px h-10 bg-slate-200 mx-2"></div>

        {/* Date & Operator */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center w-full sm:w-auto gap-2">
            <input type="date" value={startDate} max={maxDateStr} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm" />
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0">até</span>
            <input type="date" value={endDate} max={maxDateStr} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm" />
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1"></div>
          <select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)} className="w-full sm:w-56 px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm">
            <option value="">Todos os Operadores</option>
            {registeredOperators.map(op => <option key={op.id} value={op.name}>{op.name}</option>)}
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Desempenho Diário: {activeMetricLabel}</h3>
          <div className="flex flex-wrap gap-2 mt-4">
            {chartMetricsConfig.map(metric => (
              <button key={metric.key} onClick={() => setChartMetric(metric.key)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${activeChartMetric === metric.key ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'}`}>{metric.label}</button>
            ))}
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center"><Activity size={32} className="mb-2 opacity-20" /><p>Nenhum dado encontrado.</p></div>
        ) : (
          <div>
            <div className="flex items-end gap-4 sm:gap-6 overflow-x-auto pb-6 pt-12 min-h-[300px] px-2 custom-scrollbar">
              {chartData.map((data, index) => (
                <div key={index} className="group flex flex-col items-center gap-3 flex-shrink-0 w-16 transition-transform duration-300 hover:-translate-y-1 cursor-default">
                  <div className="flex items-end justify-center gap-1.5 h-48 w-full border-b-2 border-slate-100 pb-1 relative">
                    <div className="absolute inset-y-0 -inset-x-2 bg-slate-50/70 rounded-t-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 border-b-0"></div>
                    <div className="relative flex flex-col justify-end items-center w-5 h-full z-10">
                      <div className="w-full bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-md opacity-80 group-hover:opacity-100" style={{ height: maxChartValue > 0 ? `${(data.previous / maxChartValue) * 100}%` : '0%', minHeight: data.previous > 0 ? '4px' : '0' }}></div>
                      {data.previous > 0 && <span className="absolute -top-6 text-[10px] font-bold text-slate-400 group-hover:text-slate-600">{data.previous}</span>}
                    </div>
                    <div className="relative flex flex-col justify-end items-center w-7 h-full z-20">
                      <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md shadow-sm" style={{ height: maxChartValue > 0 ? `${(data.current / maxChartValue) * 100}%` : '0%', minHeight: data.current > 0 ? '4px' : '0' }}></div>
                      {data.current > 0 && <span className="absolute -top-8 text-[11px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shadow-sm border border-blue-100">{data.current}</span>}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 group-hover:text-blue-700 group-hover:bg-blue-50 px-2 py-1 rounded-md">{data.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FunnelView({ operatorData, registeredOperators }) {
  const maxDateStr = operatorData.length > 0 ? operatorData.reduce((max, p) => p.data > max ? p.data : max, operatorData[0].data) : new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(maxDateStr.substring(0, 8) + '01');
  const [endDate, setEndDate] = useState(maxDateStr);
  const [selectedOperator, setSelectedOperator] = useState('');

  // --- FILTROS INTELIGENTES (Quick Filters) ---
  const getToday = () => new Date().toISOString().split('T')[0];
  const getDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  };

  const setQuickFilter = (type) => {
    setEndDate(getToday());
    if (type === 'hoje') setStartDate(getToday());
    else if (type === '7dias') setStartDate(getDaysAgo(7));
    else if (type === 'mes') setStartDate(getFirstDayOfMonth());
  };
  // --------------------------------------------

  const filteredData = operatorData.filter(d => (selectedOperator === '' || d.operador === selectedOperator) && d.data >= startDate && d.data <= endDate);
  const totalLeads = filteredData.reduce((acc, op) => acc + Number(op.leads || 0), 0);
  const totalReunioesAgendadas = filteredData.reduce((acc, op) => acc + Number(op.reunioesAgendadas || 0), 0);
  const totalReunioesRealizadas = filteredData.reduce((acc, op) => acc + Number(op.reunioesRealizadas || 0), 0);
  const totalVendas = filteredData.reduce((acc, op) => acc + Number(op.vendas || 0), 0);

  const funnelStages = [
    { label: 'Leads Entregues', value: totalLeads, color: 'from-blue-400 to-blue-600', polygon: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)' },
    { label: 'Reuniões Agendadas', value: totalReunioesAgendadas, color: 'from-indigo-400 to-indigo-600', polygon: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)' },
    { label: 'Reuniões Realizadas', value: totalReunioesRealizadas, color: 'from-purple-400 to-purple-600', polygon: 'polygon(20% 0%, 80% 0%, 70% 100%, 30% 100%)' },
    { label: 'Vendas Realizadas', value: totalVendas, color: 'from-emerald-400 to-emerald-600', polygon: 'polygon(30% 0%, 70% 0%, 60% 100%, 40% 100%)' }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col gap-4 h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)]">
      <div className="w-full text-left shrink-0 mb-2">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 truncate"><Filter className="text-blue-600 shrink-0" /> Funil de Vendas</h1>
        <p className="text-slate-500 text-sm mt-0.5">Acompanhe as taxas de conversão de cada etapa do processo.</p>
      </div>
      
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200/80 w-full transition-all hover:shadow-md shrink-0">
        {/* Quick Filters */}
        <div className="flex gap-2 w-full xl:w-auto overflow-x-auto custom-scrollbar pb-1 xl:pb-0 shrink-0">
          <button onClick={() => setQuickFilter('hoje')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Hoje</button>
          <button onClick={() => setQuickFilter('7dias')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Últimos 7 Dias</button>
          <button onClick={() => setQuickFilter('mes')} className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all whitespace-nowrap shadow-sm">Este Mês</button>
        </div>
        
        <div className="hidden xl:block w-px h-10 bg-slate-200 mx-2"></div>
        
        {/* Date & Operator */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center w-full sm:w-auto gap-2">
            <input type="date" value={startDate} max={maxDateStr} onChange={(e)=>setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm" />
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0">até</span>
            <input type="date" value={endDate} max={maxDateStr} onChange={(e)=>setEndDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm" />
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1"></div>
          <select value={selectedOperator} onChange={(e)=>setSelectedOperator(e.target.value)} className="w-full sm:w-56 px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm">
            <option value="">Todos os Operadores</option>
            {registeredOperators.map(op => <option key={op.id} value={op.name}>{op.name}</option>)}
          </select>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-center min-h-0">
        {totalLeads === 0 ? (
          <div className="text-center text-slate-400 flex flex-col items-center"><Filter size={48} className="mb-4 opacity-20" /><p className="text-lg">Nenhum dado encontrado.</p></div>
        ) : (
          <div className="w-full max-w-lg h-full flex flex-col items-center">
            {funnelStages.map((stage, index) => {
              let conversionRate = null;
              if (index > 0 && funnelStages[index - 1].value > 0) conversionRate = ((stage.value / funnelStages[index - 1].value) * 100).toFixed(1);
              return (
                <div key={index} className="relative w-full flex-1 mb-1.5 group min-h-[60px]" style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))' }}>
                  {index > 0 && (
                    <div className="absolute -top-3.5 right-0 sm:-right-8 z-20">
                      <div className="bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md flex items-center gap-1"><svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>{conversionRate}%</div>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-b ${stage.color}`} style={{ clipPath: stage.polygon }}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-semibold opacity-90 tracking-wider text-center uppercase mb-0.5">{stage.label}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold">{stage.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InsertDataView({ operatorData, setOperatorData, editingId, setEditingId, registeredOperators }) {
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({ data: getTodayString(), operador: registeredOperators[0] || '', leads: '', ligacoes: '', atendidas: '', reunioesAgendadas: '', reunioesRealizadas: '', vendas: '', noShow: '', mrr: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [csvError, setCsvError] = useState('');
  const [csvSuccess, setCsvSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [leadMetas, setLeadMetas] = useState({});
  const [leadMetaHistory, setLeadMetaHistory] = useState([]);
  const [showLeadMetaModal, setShowLeadMetaModal] = useState(false);
  const [showMetaHistoryModal, setShowMetaHistoryModal] = useState(false);
  const [leadMetaForm, setLeadMetaForm] = useState({ operador: registeredOperators[0] || '', metaLeads: 3000 });
  const [metaHistoryFilters, setMetaHistoryFilters] = useState({ operador: 'todos', dataInicio: '', dataFim: '' });

  useEffect(() => {
    if (editingId) {
      const record = operatorData.find(op => op.id === editingId);
      if (record) setFormData(record);
    } else {
      setFormData({ data: getTodayString(), operador: registeredOperators[0] || '', leads: '', ligacoes: '', atendidas: '', reunioesAgendadas: '', reunioesRealizadas: '', vendas: '', noShow: '', mrr: '' });
    }
  }, [editingId, operatorData, registeredOperators]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLeadMetaChange = (e) => {
    const { name, value } = e.target;
    setLeadMetaForm(prev => ({ ...prev, [name]: name === 'metaLeads' ? parseInt(value) || 0 : value }));
  };

  const handleSaveLeadMeta = () => {
    if (leadMetaForm.metaLeads <= 0) {
      alert('A meta de leads deve ser maior que 0');
      return;
    }
    const previousMeta = leadMetas[leadMetaForm.operador] || null;
    const timestamp = new Date().toISOString();
    
    setLeadMetas(prev => ({ ...prev, [leadMetaForm.operador]: leadMetaForm.metaLeads }));
    
    setLeadMetaHistory(prev => [...prev, {
      id: Date.now().toString(),
      operador: leadMetaForm.operador,
      metaAnterior: previousMeta,
      metaNova: leadMetaForm.metaLeads,
      timestamp: timestamp,
      dataFormatada: new Date(timestamp).toLocaleString('pt-BR')
    }]);
    
    setShowLeadMetaModal(false);
  };

  const getLeadMetaDisplay = (operador) => {
    const meta = leadMetas[operador];
    return meta ? `Meta: ${meta.toLocaleString('pt-BR')} leads` : 'Sem meta definida';
  };

  const handleMetaHistoryFilterChange = (e) => {
    const { name, value } = e.target;
    setMetaHistoryFilters(prev => ({ ...prev, [name]: value }));
  };

  const getFilteredMetaHistory = () => {
    let filtered = leadMetaHistory;
    
    if (metaHistoryFilters.operador !== 'todos') {
      filtered = filtered.filter(record => record.operador === metaHistoryFilters.operador);
    }
    
    if (metaHistoryFilters.dataInicio) {
      const dataInicio = new Date(metaHistoryFilters.dataInicio).getTime();
      filtered = filtered.filter(record => new Date(record.timestamp).getTime() >= dataInicio);
    }
    
    if (metaHistoryFilters.dataFim) {
      const dataFim = new Date(metaHistoryFilters.dataFim).getTime() + 86400000;
      filtered = filtered.filter(record => new Date(record.timestamp).getTime() <= dataFim);
    }
    
    return filtered;
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error('Arquivo CSV vazio ou sem cabeçalho. Certifique-se de ter cabeçalho e pelo menos uma linha de dados.');

        const delimiter = lines[0].includes(';') ? ';' : ',';
        const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
        
        const newRecords = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(delimiter).map(v => v.trim());
          if (values.length < headers.length || values.every(v => !v)) continue; 

          const record = {};
          headers.forEach((header, idx) => {
            record[header] = values[idx];
          });

          let dateVal = record.data || getTodayString();
          if (dateVal.includes('/')) {
            const parts = dateVal.split('/');
            if (parts.length === 3) {
              dateVal = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }

          newRecords.push({
            id: Date.now().toString() + i,
            data: dateVal,
            operador: record.operador || registeredOperators[0] || '',
            leads: parseInt(record.leads) || 0,
            ligacoes: parseInt(record.ligacoes) || 0,
            atendidas: parseInt(record.atendidas) || 0,
            reunioesAgendadas: parseInt(record.reunioesagendadas) || 0,
            reunioesRealizadas: parseInt(record.reunioesrealizadas) || 0,
            vendas: parseInt(record.vendas) || 0,
            noShow: parseInt(record.noshow) || 0,
            mrr: parseFloat((record.mrr || '0').replace(',', '.')) || 0
          });
        }

        if (newRecords.length === 0) throw new Error('Nenhum registro válido encontrado. Verifique as colunas.');

        let updatedData = [...operatorData];
        let addedCount = 0;
        let updatedCount = 0;
        
        newRecords.forEach(newRecord => {
          // FIX 5: Comparação ignorando Maiúsculas/Minúsculas
          const existingIndex = updatedData.findIndex(op => 
            (op.operador || '').toLowerCase() === (newRecord.operador || '').toLowerCase() && 
            op.data === newRecord.data
          );
          
          if (existingIndex !== -1) {
            updatedData[existingIndex] = { ...newRecord, id: updatedData[existingIndex].id };
            updatedCount++;
          } else {
            updatedData.push(newRecord);
            addedCount++;
          }
        });
        
        updatedData.sort((a, b) => new Date(b.data) - new Date(a.data));
        setOperatorData(updatedData);
        setModalData({ count: addedCount + updatedCount, records: newRecords, addedCount, updatedCount });
        setShowModal(true);
        const message = addedCount > 0 && updatedCount > 0 
          ? `${addedCount} novos registros adicionados, ${updatedCount} atualizados!`
          : addedCount > 0
          ? `${addedCount} novos registros adicionados!`
          : `${updatedCount} registros atualizados (saldo acumulado)!`;
        setCsvSuccess(message);
        setCsvError('');
        setTimeout(() => setCsvSuccess(''), 5000);
      } catch (error) {
        setCsvError('Erro ao importar CSV: ' + error.message);
        setTimeout(() => setCsvError(''), 5000);
      }
    };
    
    // FIX 2: Adicionado Encoding para ISO-8859-1 ler acentos corretamente
    reader.readAsText(file, 'ISO-8859-1');
    if (e.target) e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    const headers = "data;operador;leads;ligacoes;atendidas;reunioesAgendadas;reunioesRealizadas;vendas;noShow;mrr\n";
    const sampleRow = "25/10/2024;Paulo Santana;10;50;20;5;3;1;2;150,50\n"; 
    const csvContent = headers + sampleRow;
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "modelo_importacao_dados.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    let newData = [...operatorData];
    
    const existingIndex = newData.findIndex(op => op.operador === formData.operador && op.data === formData.data);
    
    if (editingId) {
      const index = newData.findIndex(op => op.id === editingId);
      if (index !== -1) newData[index] = { ...formData };
      setSuccessMsg(`Lançamento atualizado!`);
    } else if (existingIndex !== -1) {
      newData[existingIndex] = { ...formData, id: newData[existingIndex].id };
      setModalData(newData[existingIndex]);
      setShowModal(true);
      setSuccessMsg(`Lançamento atualizado (saldo acumulado)!`);
    } else {
      const newRecord = { ...formData, id: Date.now().toString() };
      newData.push(newRecord);
      setModalData(newRecord);
      setShowModal(true);
      setSuccessMsg(`Novo lançamento registado!`);
    }
    
    newData.sort((a, b) => new Date(b.data) - new Date(a.data));
    setOperatorData(newData);
    setEditingId(null);
    setFormData({ data: getTodayString(), operador: formData.operador, leads: '', ligacoes: '', atendidas: '', reunioesAgendadas: '', reunioesRealizadas: '', vendas: '', noShow: '', mrr: '' });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Inserção de Dados</h1><p className="text-slate-500">Faça o lançamento diário.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {csvSuccess && <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-2"><CheckCircle size={20} />{csvSuccess}</div>}
        {csvError && <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2"><AlertCircle size={20} />{csvError}</div>}
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors">
            <label className="flex items-center justify-center gap-3 cursor-pointer h-full min-h-[80px]">
              <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
              <div className="text-center">
                <p className="font-semibold text-slate-700">Importar dados em lote (CSV)</p>
                <p className="text-sm text-slate-500">Clique para selecionar um arquivo CSV</p>
              </div>
            </label>
          </div>
          
          <button 
            type="button"
            onClick={handleDownloadTemplate}
            className="flex flex-col items-center justify-center gap-1.5 px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-slate-600 shrink-0"
            title="Baixar modelo de planilha CSV"
          >
            <Download size={24} />
            <span className="font-semibold text-sm">Baixar Modelo CSV</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Meta de Entrega de Leads por SDR</h3>
            <p className="text-sm text-slate-500">Defina a meta mensal de leads para cada operador. A meta será distribuída automaticamente nos primeiros 3 dias do mês.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowMetaHistoryModal(true)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg flex gap-2 items-center hover:bg-slate-700"
            >
              <BarChart2 size={20} />
              Historico
            </button>
            <button
              type="button"
              onClick={() => setShowLeadMetaModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex gap-2 items-center hover:bg-green-700"
            >
              <Target size={20} />
              Definir Meta
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {registeredOperators.filter(op => op.status === 'ativo').map((op) => (
            <div key={op.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-slate-900 mb-1">{op.name}</p>
              <p className="text-sm text-slate-600">{getLeadMetaDisplay(op.name)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {successMsg && <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-2"><CheckCircle size={20} />{successMsg}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2"><label className="block text-sm font-medium mb-1">Data</label><input type="date" name="data" required value={formData.data} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="lg:col-span-2"><label className="block text-sm font-medium mb-1">Operador</label><select name="operador" required value={formData.operador} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white">{registeredOperators.map((op) => <option key={op.id} value={op.name}>{op.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Leads</label><input type="number" name="leads" required value={formData.leads} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Ligações</label><input type="number" name="ligacoes" required value={formData.ligacoes} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Atendidas</label><input type="number" name="atendidas" required value={formData.atendidas} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Agendadas</label><input type="number" name="reunioesAgendadas" required value={formData.reunioesAgendadas} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Realizadas</label><input type="number" name="reunioesRealizadas" required value={formData.reunioesRealizadas} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Vendas</label><input type="number" name="vendas" required value={formData.vendas} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">No-Show</label><input type="number" name="noShow" required value={formData.noShow} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">MRR</label><input type="number" step="0.01" name="mrr" required value={formData.mrr} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="lg:col-span-4 flex justify-end gap-3 mt-4 border-t pt-6">
            {editingId && <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancelar</button>}
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg flex gap-2"><PlusCircle size={20}/>{editingId ? 'Salvar' : 'Inserir'}</button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <h3 className="text-lg font-bold mb-4">Histórico</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700"><tr><th className="px-4 py-3">Data</th><th className="px-4 py-3">Operador</th><th className="px-4 py-3">Vendas</th><th className="px-4 py-3">Ações</th></tr></thead>
            <tbody>
              {operatorData.map((op) => (
                <tr key={op.id} className="border-b"><td className="px-4 py-3">{op.data.split('-').reverse().join('/')}</td><td className="px-4 py-3">{op.operador}</td><td className="px-4 py-3 font-bold text-blue-600">{op.vendas}</td><td className="px-4 py-3 flex gap-3">
                  <button onClick={() => setEditingId(op.id)} className="text-blue-500"><Pencil size={18}/></button>
                  <button onClick={() => setOperatorData(operatorData.filter(i => i.id !== op.id))} className="text-red-400"><Trash2 size={18}/></button>
                </td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Dados Inseridos com Sucesso!</h2>
            {modalData && modalData.count ? (
              <p className="text-slate-600 mb-6">{modalData.count} novo(s) registro(s) foi/foram adicionado(s) ao sistema.</p>
            ) : modalData ? (
              <div className="text-slate-600 mb-6">
                <p className="font-semibold mb-3">Detalhes do registro:</p>
                <div className="bg-slate-50 p-3 rounded-lg text-sm space-y-2">
                  <p><strong>Data:</strong> {modalData.data?.split('-').reverse().join('/')}</p>
                  <p><strong>Operador:</strong> {modalData.operador}</p>
                  <p><strong>Leads:</strong> {modalData.leads}</p>
                  <p><strong>Vendas:</strong> {modalData.vendas}</p>
                  <p><strong>MRR:</strong> R$ {parseFloat(modalData.mrr).toFixed(2)}</p>
                </div>
              </div>
            ) : null}
            <button onClick={() => setShowModal(false)} className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              Fechar
            </button>
          </div>
        </div>
      )}

      {showLeadMetaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Target className="text-green-600" size={28} />Definir Meta de Leads</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Operador</label>
                <select
                  name="operador"
                  value={leadMetaForm.operador}
                  onChange={handleLeadMetaChange}
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                >
                  {registeredOperators.filter(op => op.status === 'ativo').map((op) => (
                    <option key={op.id} value={op.name}>{op.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta de Leads (mes)</label>
                <input
                  type="number"
                  name="metaLeads"
                  value={leadMetaForm.metaLeads}
                  onChange={handleLeadMetaChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                />
                <p className="text-xs text-slate-500 mt-2">Sera distribuida em 3 dias: {Math.floor(leadMetaForm.metaLeads / 3)} leads/dia</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLeadMetaModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveLeadMeta}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Salvar Meta
              </button>
            </div>
          </div>
        </div>
      )}

      {showMetaHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 animate-fade-in max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><BarChart2 className="text-slate-600" size={28} />Historico de Alteracoes de Metas</h2>
            
            <div className="bg-slate-50 p-4 rounded-lg mb-6 space-y-3 border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Filtros</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Operador</label>
                  <select
                    name="operador"
                    value={metaHistoryFilters.operador}
                    onChange={handleMetaHistoryFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="todos">Todos os operadores</option>
                    {registeredOperators.filter(op => op.status === 'ativo').map((op) => (
                      <option key={op.id} value={op.name}>{op.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Data Inicio</label>
                  <input
                    type="date"
                    name="dataInicio"
                    value={metaHistoryFilters.dataInicio}
                    onChange={handleMetaHistoryFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Data Fim</label>
                  <input
                    type="date"
                    name="dataFim"
                    value={metaHistoryFilters.dataFim}
                    onChange={handleMetaHistoryFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              {(metaHistoryFilters.operador !== 'todos' || metaHistoryFilters.dataInicio || metaHistoryFilters.dataFim) && (
                <button
                  onClick={() => setMetaHistoryFilters({ operador: 'todos', dataInicio: '', dataFim: '' })}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpar filtros
                </button>
              )}
            </div>
            
            {leadMetaHistory.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhuma alteracao de meta registrada ainda.</p>
            ) : getFilteredMetaHistory().length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum registro encontrado com os filtros aplicados.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">Mostrando {getFilteredMetaHistory().length} de {leadMetaHistory.length} registros</p>
                {[...getFilteredMetaHistory()].reverse().map((record) => (
                  <div key={record.id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{record.operador}</p>
                        <p className="text-xs text-slate-500">{record.dataFormatada}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Meta Anterior: <span className="font-semibold text-slate-900">{record.metaAnterior ? record.metaAnterior.toLocaleString('pt-BR') : 'N/A'}</span></p>
                        <p className="text-sm text-green-600">Meta Nova: <span className="font-semibold text-green-700">{record.metaNova.toLocaleString('pt-BR')}</span></p>
                      </div>
                    </div>
                    {record.metaAnterior && (
                      <div className="text-xs text-slate-500 mt-2">
                        Diferenca: {record.metaNova > record.metaAnterior ? '+' : ''}{(record.metaNova - record.metaAnterior).toLocaleString('pt-BR')} leads
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowMetaHistoryModal(false)}
              className="w-full mt-6 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CadastrosView({ registeredOperators, setRegisteredOperators, systemUsers, setSystemUsers, systemModules, setSystemModules, metas, setMetas }) {
  const [activeTab, setActiveTab] = useState('operadores');
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><FolderPlus className="text-blue-600" /> Cadastros</h1></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b bg-slate-50 overflow-x-auto">
          <button onClick={() => setActiveTab('operadores')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 ${activeTab === 'operadores' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500'}`}><Users size={18} /> Operadores</button>
          <button onClick={() => setActiveTab('usuarios')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 ${activeTab === 'usuarios' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500'}`}><Shield size={18} /> Usuários de Acesso</button>
          <button onClick={() => setActiveTab('outros')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 ${activeTab === 'outros' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500'}`}><ListPlus size={18} /> Módulos</button>
          <button onClick={() => setActiveTab('metas')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 ${activeTab === 'metas' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500'}`}><Target size={18} /> Metas Globais</button>
          <button onClick={() => setActiveTab('metas-individuais')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 ${activeTab === 'metas-individuais' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500'}`}><Target size={18} /> Metas Individuais</button>
        </div>
        <div className="p-6">
          {activeTab === 'operadores' && <ManageOperatorsTab registeredOperators={registeredOperators} setRegisteredOperators={setRegisteredOperators} />}
          {activeTab === 'usuarios' && <ManageUsersTab systemUsers={systemUsers} setSystemUsers={setSystemUsers} />}
          {activeTab === 'outros' && <ManageModulesTab systemModules={systemModules} setSystemModules={setSystemModules} />}
          {activeTab === 'metas' && <ManageMetasTab metas={metas} setMetas={setMetas} />}
          {activeTab === 'metas-individuais' && <ManageIndividualGoalsTab registeredOperators={registeredOperators} />}
        </div>
      </div>
    </div>
  );
}

function ManageMetasTab({ metas, setMetas }) {
  const [localMetas, setLocalMetas] = useState(metas);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMetas(localMetas);
    setSuccessMsg('Metas globais atualizadas com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Definição de Metas Globais</h3>
        <p className="text-sm text-slate-500">Estes valores serão usados no Dashboard Gerencial para calcular o progresso da equipa.</p>
      </div>
      
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-2 border border-emerald-200">
          <CheckCircle size={20} />{successMsg}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700">Meta de Vendas</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TrendingUp size={16} className="text-slate-400" />
              </div>
              <input type="number" required min="1" value={localMetas.vendas} onChange={e => setLocalMetas({...localMetas, vendas: Number(e.target.value)})} className="w-full pl-9 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="Ex: 50" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700">Meta de Conversão (%)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-slate-400" />
              </div>
              <input type="number" required min="1" max="100" value={localMetas.conversao} onChange={e => setLocalMetas({...localMetas, conversao: Number(e.target.value)})} className="w-full pl-9 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="Ex: 15" />
            </div>
          </div>
          
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-bold text-slate-700">Meta de MRR (R$)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-slate-400" />
              </div>
              <input type="number" required min="1" step="0.01" value={localMetas.mrr} onChange={e => setLocalMetas({...localMetas, mrr: Number(e.target.value)})} className="w-full pl-9 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="Ex: 25000" />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
            <Target size={18} />
            Salvar Novas Metas
          </button>
        </div>
      </form>
    </div>
  );
}

function ManageIndividualGoalsTab({ registeredOperators }) {
  // FIX 4: JSON.parse Try/Catch para individualGoals
  const [individualGoals, setIndividualGoals] = useState(() => {
    try {
      const stored = localStorage.getItem('individualGoals');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });
  
  // FIX 4: JSON.parse Try/Catch para goalsHistory
  const [goalsHistory, setGoalsHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('goalsHistory');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [formGoals, setFormGoals] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const getOperatorGoals = (opId) => {
    const key = `${opId}-${selectedMonth}`;
    return individualGoals[key] || {
      leadsEntregues: 0,
      reunioesRealizadas: 0,
      taxaConexao: 0,
      taxaConversao: 0,
      ligacoesDiarias: 0
    };
  };

  const handleOpenModal = (op) => {
    setSelectedOperator(op);
    setFormGoals(getOperatorGoals(op.id));
  };

  const handleSaveGoals = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    const key = `${selectedOperator.id}-${selectedMonth}`;
    const updated = { ...individualGoals, [key]: formGoals };
    setIndividualGoals(updated);
    localStorage.setItem('individualGoals', JSON.stringify(updated));
    
    // Add to history with timestamp
    const historyKey = `${selectedOperator.id}-${selectedMonth}`;
    const currentHistory = goalsHistory[historyKey] || [];
    const newEntry = {
      ...formGoals,
      savedAt: new Date().toISOString(),
      savedBy: selectedOperator.name
    };
    const updatedHistory = { ...goalsHistory, [historyKey]: [...currentHistory, newEntry] };
    setGoalsHistory(updatedHistory);
    localStorage.setItem('goalsHistory', JSON.stringify(updatedHistory));
    
    setShowConfirmModal(false);
    setSelectedOperator(null);
    setFormGoals(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Metas Individuais por Operador</h3>
        <p className="text-sm text-slate-500">Selecione um operador para definir suas metas mensais.</p>
      </div>



      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Operadores Ativos</h4>
        <div className="space-y-2">
          {registeredOperators.filter(op => op.status === 'ativo').map((op) => {
            const hasGoals = !!individualGoals[`${op.id}-${selectedMonth}`];
            return (
              <button
                key={op.id}
                onClick={() => handleOpenModal(op)}
                className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors flex justify-between items-center"
              >
                <span className="font-medium text-slate-800">{op.name}</span>
                {hasGoals && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Metas Definidas</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedOperator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Metas de {selectedOperator.name}</h2>
              <p className="text-sm text-slate-500">Defina as metas mensais para este operador. Todas as métricas são importantes para o acompanhamento de desempenho.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-600 mb-2">Mês</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Leads Entregues</label>
                <input
                  type="number"
                  value={formGoals.leadsEntregues}
                  onChange={(e) => setFormGoals({...formGoals, leadsEntregues: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-lg font-semibold"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Reuniões Realizadas</label>
                <input
                  type="number"
                  value={formGoals.reunioesRealizadas}
                  onChange={(e) => setFormGoals({...formGoals, reunioesRealizadas: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-lg font-semibold"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Taxa de Conexão (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formGoals.taxaConexao}
                  onChange={(e) => setFormGoals({...formGoals, taxaConexao: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-lg font-semibold"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Taxa de Conversão para Reunião (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formGoals.taxaConversao}
                  onChange={(e) => setFormGoals({...formGoals, taxaConversao: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-lg font-semibold"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Ligações Diárias</label>
                <input
                  type="number"
                  value={formGoals.ligacoesDiarias}
                  onChange={(e) => setFormGoals({...formGoals, ligacoesDiarias: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-lg font-semibold"
                />
              </div>
            </div>

            {individualGoals[`${selectedOperator.id}-${selectedMonth}`] && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Metas Salvas para {selectedMonth}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-600">Leads Entregues</p>
                    <p className="text-lg font-bold text-slate-900">{individualGoals[`${selectedOperator.id}-${selectedMonth}`].leadsEntregues}</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-600">Reuniões Realizadas</p>
                    <p className="text-lg font-bold text-slate-900">{individualGoals[`${selectedOperator.id}-${selectedMonth}`].reunioesRealizadas}</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-600">Taxa de Conexão</p>
                    <p className="text-lg font-bold text-slate-900">{individualGoals[`${selectedOperator.id}-${selectedMonth}`].taxaConexao}%</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-600">Taxa de Conversão</p>
                    <p className="text-lg font-bold text-slate-900">{individualGoals[`${selectedOperator.id}-${selectedMonth}`].taxaConversao}%</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-slate-200 md:col-span-2">
                    <p className="text-xs text-slate-600">Ligações Diárias</p>
                    <p className="text-lg font-bold text-slate-900">{individualGoals[`${selectedOperator.id}-${selectedMonth}`].ligacoesDiarias}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-between border-t pt-6">
              <button onClick={() => setShowHistoryModal(true)} className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                Ver Histórico
              </button>
              <div className="flex gap-3">
                <button onClick={() => setSelectedOperator(null)} className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                  Cancelar
                </button>
                <button onClick={handleSaveGoals} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && selectedOperator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Historico de Metas - {selectedOperator.name}</h2>
            
            {goalsHistory[`${selectedOperator.id}-${selectedMonth}`] && goalsHistory[`${selectedOperator.id}-${selectedMonth}`].length > 0 ? (
              <div className="space-y-4">
                {goalsHistory[`${selectedOperator.id}-${selectedMonth}`].map((entry, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Entrada #{goalsHistory[`${selectedOperator.id}-${selectedMonth}`].length - index}</p>
                        <p className="text-xs text-slate-500">{new Date(entry.savedAt).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <p className="text-xs text-slate-600">Leads Entregues</p>
                        <p className="text-sm font-bold text-slate-900">{entry.leadsEntregues}</p>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <p className="text-xs text-slate-600">Reunioes Realizadas</p>
                        <p className="text-sm font-bold text-slate-900">{entry.reunioesRealizadas}</p>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <p className="text-xs text-slate-600">Taxa de Conexao</p>
                        <p className="text-sm font-bold text-slate-900">{entry.taxaConexao}%</p>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <p className="text-xs text-slate-600">Taxa de Conversao</p>
                        <p className="text-sm font-bold text-slate-900">{entry.taxaConversao}%</p>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200 md:col-span-2">
                        <p className="text-xs text-slate-600">Ligacoes Diarias</p>
                        <p className="text-sm font-bold text-slate-900">{entry.ligacoesDiarias}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-600">Nenhum historico de metas para {selectedMonth}</p>
              </div>
            )}
            
            <div className="flex gap-3 justify-end border-t pt-6 mt-6">
              <button onClick={() => setShowHistoryModal(false)} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Confirmar Alteração</h3>
            <p className="text-slate-600 mb-6">
              Deseja realmente salvar as metas individuais para {selectedOperator.name}?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleConfirmSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageOperatorsTab({ registeredOperators, setRegisteredOperators }) {
  const [newOperator, setNewOperator] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingEdit, setPendingEdit] = useState(null);
  const handleAddOperator = (e) => { 
    e.preventDefault(); 
    if(newOperator) { 
      const newOp = { id: Date.now().toString(), name: newOperator, status: 'ativo' };
      setRegisteredOperators([...registeredOperators, newOp]); 
      setNewOperator(''); 
    } 
  };
  const handleDeactivateOperator = (opId) => {
    setRegisteredOperators(registeredOperators.map(op => op.id === opId ? { ...op, status: 'inativo' } : op));
  };
  const handleReactivateOperator = (opId) => {
    setRegisteredOperators(registeredOperators.map(op => op.id === opId ? { ...op, status: 'ativo' } : op));
  };
  const handleEditOperator = (op) => {
    setEditingId(op.id);
    setEditingName(op.name);
  };
  const handleSaveEdit = () => {
    if(editingName.trim()) {
      const oldName = registeredOperators.find(op => op.id === editingId)?.name;
      setPendingEdit({ id: editingId, oldName, newName: editingName });
      setShowConfirmModal(true);
    }
  };
  const handleConfirmEdit = () => {
    if(pendingEdit) {
      setRegisteredOperators(registeredOperators.map(op => op.id === pendingEdit.id ? { ...op, name: pendingEdit.newName } : op));
      setEditingId(null);
      setEditingName('');
      setShowConfirmModal(false);
      setPendingEdit(null);
    }
  };
  const handleRejectEdit = () => {
    setShowConfirmModal(false);
    setPendingEdit(null);
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setShowConfirmModal(false);
    setPendingEdit(null);
  };
  return (
    <div className="space-y-6">
      <form onSubmit={handleAddOperator} className="flex gap-4"><input type="text" value={newOperator} onChange={e=>setNewOperator(e.target.value)} required className="flex-1 border px-4 py-2 rounded" placeholder="Novo operador"/><button type="submit" className="bg-blue-600 text-white px-6 rounded">Adicionar</button></form>
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 mb-4">Operadores Ativos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {registeredOperators.filter(op => op.status === 'ativo').map((op) => (
            <div key={op.id} className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center">
              {editingId === op.id ? (
                <div className="flex-1 flex gap-2">
                  <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" />
                  <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50 transition-colors">✓</button>
                  <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors">✕</button>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-slate-900">{op.name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditOperator(op)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors" title="Editar operador">
                      <Pencil size={18}/>
                    </button>
                    <button onClick={() => handleDeactivateOperator(op.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors" title="Desativar operador">
                      <UserX size={18}/>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {registeredOperators.some(op => op.status === 'inativo') && (
          <div className="mt-8">
            <h3 className="font-semibold text-slate-900 mb-4">Operadores Inativos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {registeredOperators.filter(op => op.status === 'inativo').map((op) => (
                <div key={op.id} className="border p-4 rounded-lg bg-slate-50 shadow-sm flex justify-between items-center opacity-75">
                  <span className="font-medium text-slate-600">{op.name}</span>
                  <button onClick={() => handleReactivateOperator(op.id)} className="text-green-500 hover:text-green-700 hover:bg-green-50 p-2 rounded transition-colors" title="Reativar operador">
                    <CheckCircle size={18}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {showConfirmModal && pendingEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Confirmar Alteração</h3>
            <p className="text-slate-600 mb-6">
              Deseja realmente alterar o nome de <span className="font-semibold">"{pendingEdit.oldName}"</span> para <span className="font-semibold">"{pendingEdit.newName}"</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={handleRejectEdit} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleConfirmEdit} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageUsersTab({ systemUsers, setSystemUsers }) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const handleAddUser = (e) => {
    e.preventDefault();
    if(newUsername && newPassword) {
      setSystemUsers([...systemUsers, { id: Date.now().toString(), username: newUsername, password: newPassword, role: newRole, name: '', photo: '' }]);
      // FIX 1: set functions must be used to update state properly
      setNewUsername(''); 
      setNewPassword('');
    }
  };
  return (
    <div className="space-y-6">
      <form onSubmit={handleAddUser} className="grid grid-cols-4 gap-4">
        <input type="text" placeholder="Login" value={newUsername} onChange={e=>setNewUsername(e.target.value)} required className="border px-4 py-2 rounded" />
        <input type="password" placeholder="Senha" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required className="border px-4 py-2 rounded" />
        <select value={newRole} onChange={e=>setNewRole(e.target.value)} className="border px-4 py-2 rounded"><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select>
        <button type="submit" className="bg-blue-600 text-white rounded">Adicionar</button>
      </form>
      <div className="border rounded overflow-hidden">
        <table className="w-full text-left"><thead className="bg-slate-50 border-b"><tr><th className="p-4">Utilizador</th><th className="p-4">Regra</th><th className="p-4">Ação</th></tr></thead><tbody>
          {systemUsers.map(u => (
            <tr key={u.id} className="border-b"><td className="p-4">{u.username}</td><td className="p-4">{u.role}</td><td className="p-4"><button onClick={() => setSystemUsers(systemUsers.filter(x => x.id !== u.id))} className="text-red-500"><Trash2 size={18}/></button></td></tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}

function ManageModulesTab({ systemModules, setSystemModules }) {
  const [newModule, setNewModule] = useState('');
  const handleAddModule = (e) => { e.preventDefault(); if(newModule) { setSystemModules([...systemModules, newModule]); setNewModule(''); } };
  return (
    <div className="space-y-6">
      <form onSubmit={handleAddModule} className="flex gap-4"><input type="text" value={newModule} onChange={e=>setNewModule(e.target.value)} required className="flex-1 border px-4 py-2 rounded" placeholder="Novo módulo"/><button type="submit" className="bg-blue-600 text-white px-6 rounded">Adicionar</button></form>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {systemModules.map((mod, i) => (
          <div key={i} className="border p-4 rounded flex justify-between"><span>{mod}</span><button onClick={() => setSystemModules(systemModules.filter(m => m !== mod))} className="text-red-500"><Trash2 size={18}/></button></div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ user, setCurrentUser, systemUsers, setSystemUsers }) {
  const [activeTab, setActiveTab] = useState('perfil');
  
  // Estados do Perfil
  const [name, setName] = useState(user.name || '');
  const [password, setPassword] = useState(user.password || '');
  const [photo, setPhoto] = useState(user.photo || '');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados das Integrações
  const [n8nUrl, setN8nUrl] = useState('');
  const [pipedriveToken, setPipedriveToken] = useState('');
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [integrationSuccess, setIntegrationSuccess] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    const updatedUsers = systemUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, name, password, photo };
      }
      return u;
    });
    setSystemUsers(updatedUsers);
    setCurrentUser({ ...user, name, password, photo });
    
    setSuccessMsg('Perfil atualizado com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveIntegrations = (e) => {
    e.preventDefault();
    // Aqui no futuro adicionaremos a lógica real de teste/salvamento de chaves
    setIntegrationSuccess('Configurações de integração guardadas com sucesso!');
    setTimeout(() => setIntegrationSuccess(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="text-blue-600" /> Configurações do Sistema
        </h1>
        <p className="text-slate-500">Faça a gestão do seu perfil e conecte o sistema com outras ferramentas.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Navegação por Abas */}
        <div className="flex border-b bg-slate-50 overflow-x-auto">
          <button onClick={() => setActiveTab('perfil')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'perfil' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <User size={18} /> Meu Perfil
          </button>
          <button onClick={() => setActiveTab('integracoes')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'integracoes' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <Plug size={18} /> Integrações e Webhooks
          </button>
          <button onClick={() => setActiveTab('documentacao')} className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'documentacao' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <BarChart2 size={18} /> Documentação de API
          </button>
        </div>

        {/* CONTEÚDO DA ABA: PERFIL */}
        {activeTab === 'perfil' ? (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-6 animate-fade-in">
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex gap-2 text-sm font-medium border border-emerald-200">
                <CheckCircle size={20} className="shrink-0" /> {successMsg}
              </div>
            )}

            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 bg-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
                  {photo ? (
                    <img src={photo} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <UserPlus size={36} className="text-slate-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 transition-all border-2 border-white">
                  <Camera size={14} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="text-center sm:text-left flex-1 pt-2">
                <h4 className="font-bold text-slate-800 text-lg">{user.username}</h4>
                <p className="text-sm text-slate-500 mb-2">Conta {user.role === 'ADMIN' ? 'Administrador' : 'Utilizador'}</p>
                <label className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                  Carregar nova foto
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como gostaria de ser chamado?" className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nova Palavra-passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full sm:w-auto px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors">
                Salvar Alterações de Perfil
              </button>
            </div>
          </form>
        ) : activeTab === 'integracoes' ? (
          /* CONTEÚDO DA ABA: INTEGRAÇÕES */
          <form onSubmit={handleSaveIntegrations} className="p-6 space-y-6 animate-fade-in">
            {integrationSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex gap-2 text-sm font-medium border border-emerald-200">
                <CheckCircle size={20} className="shrink-0" /> {integrationSuccess}
              </div>
            )}

            <div className="space-y-6">
              
              {/* Card: n8n */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-orange-300 transition-colors">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                    <Webhook size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 text-lg">Automação n8n</h4>
                      <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Recomendado</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Dispare Webhooks para os seus fluxos do n8n sempre que um operador lançar novos dados (ex: nova venda registada).</p>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Webhook URL (Production ou Test Endpoint)</label>
                      <input type="url" value={n8nUrl} onChange={(e) => setN8nUrl(e.target.value)} placeholder="https://seu-n8n.com/webhook/..." className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Pipedrive */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-green-300 transition-colors">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <Plug size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">Pipedrive CRM</h4>
                    <p className="text-sm text-slate-500 mb-4">Sincronize contactos e mova negócios (deals) no funil do Pipedrive de acordo com os lançamentos efetuados aqui.</p>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Chave de API (Personal API Token)</label>
                      <input type="password" value={pipedriveToken} onChange={(e) => setPipedriveToken(e.target.value)} placeholder="Insira o seu token do Pipedrive" className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Webhook Genérico */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-blue-300 transition-colors">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Link2 size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">Webhook Customizado</h4>
                    <p className="text-sm text-slate-500 mb-4">Envie um POST genérico para qualquer outra API (Make, Zapier) quando as metas de equipa sofrerem alterações.</p>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Endpoint URL (POST)</label>
                      <input type="url" value={customWebhookUrl} onChange={(e) => setCustomWebhookUrl(e.target.value)} placeholder="https://sua-api.com/endpoint" className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2">
                <CheckCircle size={18} />
                Guardar Integrações
              </button>
            </div>
          </form>
        ) : activeTab === 'documentacao' ? (
          <APIDocumentation />
        ) : null}
      </div>
    </div>
  );
}



function AdminMessagesView({ systemUsers, chatMessages, setChatMessages }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const chatEndRef = useRef(null);

  const standardUsers = systemUsers.filter(u => u.role !== 'ADMIN');
  const activeChatMessages = selectedUserId ? chatMessages.filter(m => m.userId === selectedUserId) : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    const msg = {
      id: Date.now().toString(),
      userId: selectedUserId,
      sender: 'admin', 
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    if (selectedUserId) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatMessages, selectedUserId]);

  const getLatestMessage = (userId) => {
    const userMsgs = chatMessages.filter(m => m.userId === userId);
    return userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : null;
  };

  const handleClearChat = () => {
    setChatMessages(chatMessages.filter(m => m.userId !== selectedUserId));
    setConfirmClear(false);
  };

  const handleDeleteMessage = (msgId) => {
    setChatMessages(chatMessages.filter(m => m.id !== msgId));
  };

  const startEditing = (msg) => {
    setEditingMsgId(msg.id);
    setEditingText(msg.text);
  };

  const saveEdit = (msgId) => {
    if (!editingText.trim()) return;
    setChatMessages(chatMessages.map(m => m.id === msgId ? { ...m, text: editingText, isEdited: true } : m));
    setEditingMsgId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingMsgId(null);
    setEditingText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)]">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="text-blue-600" /> Caixa de Mensagens
        </h1>
        <p className="text-slate-500">Responda a solicitações e converse com os utilizadores do sistema.</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-0">
        
        <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 shrink-0 bg-white">
            <h3 className="font-bold text-slate-800">Contatos</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {standardUsers.map(u => {
              const lastMsg = getLatestMessage(u.id);
              const isUnread = lastMsg && lastMsg.sender === 'user';
              
              return (
                <button 
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`w-full text-left p-4 border-b border-slate-100 flex items-center gap-3 transition-colors hover:bg-slate-100 ${selectedUserId === u.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="relative shrink-0">
                    {u.photo ? (
                      <img src={u.photo} alt="Foto" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                        {(u.name || u.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isUnread && <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>{u.name || u.username}</p>
                    {lastMsg ? (
                      <p className={`text-xs truncate mt-0.5 ${isUnread ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                        {lastMsg.sender === 'admin' ? 'Você: ' : ''}{lastMsg.text}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-0.5">Nenhuma mensagem</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedUserId ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white relative">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  {(systemUsers.find(u => u.id === selectedUserId)?.name || systemUsers.find(u => u.id === selectedUserId)?.username || '').charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-slate-800">{systemUsers.find(u => u.id === selectedUserId)?.name || systemUsers.find(u => u.id === selectedUserId)?.username}</h3>
              </div>
              
              {activeChatMessages.length > 0 && (
                <button 
                  onClick={() => setConfirmClear(true)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Apagar conversa"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            {confirmClear && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 max-w-sm w-full text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Apagar toda a conversa?</h3>
                  <p className="text-sm text-slate-500 mb-6">Esta ação apagará definitivamente o histórico de mensagens com este utilizador.</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setConfirmClear(false)} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancelar</button>
                    <button onClick={handleClearChat} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors">Sim, apagar</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#f8f9fa] custom-scrollbar">
              {activeChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-50">
                  <MessageSquare size={48} />
                  <p>Inicie a conversa com este utilizador.</p>
                </div>
              ) : (
                activeChatMessages.map(msg => (
                  <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} group/msg`}>
                    
                    {msg.sender === 'admin' && editingMsgId !== msg.id && (
                      <div className="opacity-0 group-hover/msg:opacity-100 flex flex-col justify-center gap-1 transition-all shrink-0 mt-1">
                        <button onClick={() => startEditing(msg)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all" title="Editar mensagem">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Apagar mensagem">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.sender === 'admin' ? 'bg-[#0052cc] text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'}`}>
                      {editingMsgId === msg.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea 
                            value={editingText} 
                            onChange={(e) => setEditingText(e.target.value)} 
                            className="w-full text-sm text-slate-800 p-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[200px]"
                            rows="2"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-1">
                            <button onClick={cancelEdit} className="text-xs px-3 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors font-medium">Cancelar</button>
                            <button onClick={() => saveEdit(msg.id)} className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors font-medium">Salvar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <div className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${msg.sender === 'admin' ? 'text-blue-200' : 'text-slate-400'}`}>
                            {msg.isEdited && <span className="italic mr-1">(editado)</span>}
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {msg.sender === 'user' && editingMsgId !== msg.id && (
                      <div className="opacity-0 group-hover/msg:opacity-100 flex flex-col justify-center gap-1 transition-all shrink-0 mt-1">
                        <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Apagar mensagem">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva a resposta..." 
                  className="flex-1 px-4 py-2.5 bg-[#f4f5f7] border border-transparent focus:bg-white focus:border-[#0052cc] rounded-full focus:ring-1 focus:ring-[#0052cc] outline-none transition-all text-sm"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 rounded-full bg-[#0052cc] text-white flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shrink-0 shadow-sm"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50">
            <MessageSquare size={64} className="mb-4 opacity-20 text-slate-500" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">Caixa de Entrada Vazia</h3>
            <p>Selecione um utilizador na lista lateral para ler ou enviar mensagens.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- WIDGET FLUTUANTE DE CHAT (Utilizador -> Admin) ---
function FloatingChatWidget({ user, adminUser, chatMessages, setChatMessages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const chatEndRef = useRef(null);

  const userMessages = chatMessages.filter(m => m.userId === user.id);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, userMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now().toString(),
      userId: user.id,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const startEditing = (msg) => {
    setEditingMsgId(msg.id);
    setEditingText(msg.text);
  };

  const saveEdit = (msgId) => {
    if (!editingText.trim()) return;
    setChatMessages(chatMessages.map(m => m.id === msgId ? { ...m, text: editingText, isEdited: true } : m));
    setEditingMsgId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingMsgId(null);
    setEditingText('');
  };

  const handleDeleteMessage = (msgId) => {
    setChatMessages(chatMessages.filter(m => m.id !== msgId));
  };

  const adminName = adminUser?.name || adminUser?.username || 'Suporte';
  const adminPhoto = adminUser?.photo;

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[3px] border-white overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out bg-slate-100 flex items-center justify-center cursor-pointer group"
          title="Falar com o Suporte"
        >
          {adminPhoto ? (
            <img src={adminPhoto} alt={adminName} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
          ) : (
             <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold group-hover:bg-blue-700 transition-colors">
               {adminName.charAt(0).toUpperCase()}
             </div>
          )}
          <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 z-50 w-[90vw] sm:w-[380px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-slide-up origin-bottom-right">
          
          <div className="bg-[#0052cc] text-white p-4 flex items-center justify-between shrink-0 shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {adminPhoto ? (
                  <img src={adminPhoto} alt={adminName} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border-2 border-white/30">
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0052cc] rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-sm leading-tight text-white">{adminName} - Impacto Tecnologia</h4>
                <p className="text-[11px] text-blue-100 font-medium">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa] space-y-4 custom-scrollbar">
            {userMessages.length === 0 ? (
              <div className="text-center text-slate-400 mt-12 space-y-3">
                <MessageSquare size={40} className="mx-auto opacity-20 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-600">Olá, tudo bem?</p>
                  <p className="text-xs mt-1">Como posso te ajudar hoje?</p>
                </div>
              </div>
            ) : (
              userMessages.map(msg => (
                <div key={msg.id} className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group/msg`}>
                  
                  {msg.sender === 'admin' && (
                    <div className="w-7 h-7 rounded-full overflow-hidden mr-2 shrink-0 mt-1">
                       {adminPhoto ? (
                         <img src={adminPhoto} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-[#0052cc] text-white flex items-center justify-center text-[10px] font-bold">
                           {adminName.charAt(0).toUpperCase()}
                         </div>
                       )}
                    </div>
                  )}

                  {msg.sender === 'user' && editingMsgId !== msg.id && (
                    <div className="opacity-0 group-hover/msg:opacity-100 flex flex-col justify-center gap-1 transition-all shrink-0 mr-2 mt-1">
                      <button onClick={() => startEditing(msg)} className="p-1.5 text-slate-400 hover:text-blue-500 bg-white rounded-full shadow-sm border border-slate-100 transition-all" title="Editar mensagem">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-white rounded-full shadow-sm border border-slate-100 transition-all" title="Apagar mensagem">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}

                  <div className={`max-w-[78%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-2.5 shadow-sm text-[13px] leading-relaxed w-full ${
                      msg.sender === 'user' 
                        ? 'bg-[#0052cc] text-white rounded-br-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                    }`}>
                      {editingMsgId === msg.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea 
                            value={editingText} 
                            onChange={(e) => setEditingText(e.target.value)} 
                            className="w-full text-sm text-slate-800 p-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[180px]"
                            rows="2"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-1">
                            <button onClick={cancelEdit} className="text-[11px] px-2.5 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors font-medium">Cancelar</button>
                            <button onClick={() => saveEdit(msg.id)} className="text-[11px] px-2.5 py-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors font-medium">Salvar</button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      )}
                    </div>
                    {editingMsgId !== msg.id && (
                      <span className="text-[10px] text-slate-400 mt-1 mx-1 opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1">
                        {msg.isEdited && <span className="italic">(editado)</span>}
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreva a sua mensagem..." 
                className="flex-1 px-4 py-2.5 bg-[#f4f5f7] border border-transparent focus:bg-white focus:border-[#0052cc] rounded-full focus:ring-1 focus:ring-[#0052cc] outline-none transition-all text-sm text-slate-700"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="w-10 h-10 rounded-full bg-[#0052cc] text-white flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shrink-0 shadow-sm"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
            <div className="mt-2 text-center">
              <span className="text-[9px] text-slate-400 flex items-center justify-center gap-1">
                Feito com <ImpactoLogo className="w-3 h-3 text-[#0052cc]" /> Impacto
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- TELA DE LOGIN ---
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Credenciais inválidas. Verifique o seu utilizador e palavra-passe.');
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-50 relative flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden box-border">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50 z-0"></div>
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        <div 
          className="flex items-center gap-3 sm:gap-4 transform transition-all duration-500 hover:scale-105 cursor-pointer mb-2 sm:mb-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ImpactoLogo className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md rounded-lg transform transition-transform duration-300 hover:scale-110" />
          <span className="text-xl sm:text-2xl font-bold text-slate-700">Impacto Tecnologia</span>
        </div>
      </div>

      <div className="w-full max-w-md mt-6 sm:mt-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-6 px-5 sm:py-8 sm:px-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl sm:rounded-3xl border border-white transition-all duration-500 hover:shadow-[0_8px_40px_rgb(59,130,246,0.15)]">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 ml-1">Utilizador</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  required 
                  className="block w-full pl-9 sm:pl-11 px-3 sm:px-4 py-2.5 sm:py-3.5 bg-slate-50/50 border border-slate-200 rounded-lg sm:rounded-xl shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-300 outline-none hover:border-blue-300" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Seu nome de usuário" 
                />
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 ml-1">Palavra-passe</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                </div>
                <input 
                  type="password" 
                  required 
                  className="block w-full pl-9 sm:pl-11 px-3 sm:px-4 py-2.5 sm:py-3.5 bg-slate-50/50 border border-slate-200 rounded-lg sm:rounded-xl shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-300 outline-none hover:border-blue-300" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center py-2.5 sm:py-3.5 px-4 border border-transparent rounded-lg sm:rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg active:scale-[0.98] mt-2 sm:mt-4"
            >
              Entrar no Sistema
            </button>
          </form>
          
          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500 text-center">
              Acesso Usuário: <strong>nome.sobrenome / *****</strong><br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- LAYOUT PRINCIPAL (Sidebar + Conteúdo) ---
function MainLayout({ user, setCurrentUser, onLogout, operatorData, setOperatorData, registeredOperators, setRegisteredOperators, systemUsers, setSystemUsers, systemModules, setSystemModules, metas, setMetas, chatMessages, setChatMessages, notifications: propsNotifications, setNotifications: propsSetNotifications }: any) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const notifications = propsNotifications || [];
  const setNotifications = propsSetNotifications || (() => {});

  const adminUser = systemUsers.find((u: any) => u.role === 'ADMIN');

  useEffect(() => {
    if (operatorData.length === 0) return;

    const totalVendas = operatorData.reduce((acc: number, op: any) => acc + Number(op.vendas || 0), 0);
    const totalMRR = operatorData.reduce((acc: number, op: any) => acc + Number(op.mrr || 0), 0);
    const totalAtendidas = operatorData.reduce((acc: number, op: any) => acc + Number(op.atendidas || 0), 0);
    const totalReunioesRealizadas = operatorData.reduce((acc: number, op: any) => acc + Number(op.reunioesRealizadas || 0), 0);
    const conversaoRate = totalAtendidas > 0 ? (totalReunioesRealizadas / totalAtendidas) * 100 : 0;

    const newNotifications: any[] = [];

    if (totalVendas >= metas.vendas && totalVendas > 0) {
      const existsVendaNotif = notifications.some((n: any) => n.title.includes('Meta de Vendas'));
      if (!existsVendaNotif) {
        newNotifications.push({
          id: `vendas-${Date.now()}`,
          type: 'success',
          title: 'Meta de Vendas Atingida!',
          message: `A equipe atingiu ${totalVendas} vendas! Meta: ${metas.vendas}`,
          timestamp: new Date(),
          read: false,
        });
      }
    }

    if (totalMRR >= metas.mrr && totalMRR > 0) {
      const existsMRRNotif = notifications.some((n: any) => n.title.includes('Meta de MRR'));
      if (!existsMRRNotif) {
        newNotifications.push({
          id: `mrr-${Date.now()}`,
          type: 'success',
          title: 'Meta de MRR Atingida!',
          message: `MRR total: R$ ${totalMRR.toLocaleString('pt-BR')}. Meta: R$ ${metas.mrr.toLocaleString('pt-BR')}`,
          timestamp: new Date(),
          read: false,
        });
      }
    }

    if (conversaoRate < metas.conversao && totalAtendidas > 0) {
      const existsConvNotif = notifications.some((n: any) => n.title.includes('Taxa de Conversao'));
      if (!existsConvNotif) {
        newNotifications.push({
          id: `conversao-${Date.now()}`,
          type: 'warning',
          title: 'Taxa de Conversao Baixa',
          message: `Taxa atual: ${conversaoRate.toFixed(1)}%. Meta: ${metas.conversao}%`,
          timestamp: new Date(),
          read: false,
        });
      }
    }

    const lastRecord = operatorData[operatorData.length - 1];
    if (lastRecord && Number(lastRecord.vendas || 0) > 0) {
      const lastRecordMRR = Number(lastRecord.mrr || 0);
      const existsVendaIndividualNotif = notifications.some((n: any) => 
        n.title.includes('Novo Lancamento') && n.message.includes(lastRecord.operador)
      );
      if (!existsVendaIndividualNotif) {
        newNotifications.push({
          id: `venda-${lastRecord.operador}-${Date.now()}`,
          type: 'success',
          title: 'Novo Lancamento',
          message: `${lastRecord.operador} fez um lancamento de R$ ${lastRecordMRR.toLocaleString('pt-BR')}. MRR Total: R$ ${totalMRR.toLocaleString('pt-BR')}`,
          timestamp: new Date(),
          read: false,
        });
      }
    }

    if (newNotifications.length > 0) {
      setNotifications((prev: any) => [...newNotifications, ...prev]);
    }
  }, [operatorData, metas]);

  const handleNavigation = (view: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsMobileMenuOpen(false);
      setIsCollapsed(true);
      setIsLoading(false);
    }, 500);
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    const content = (() => {
      switch (currentView) {
        case 'dashboard':
          return <DashboardView operatorData={operatorData} registeredOperators={registeredOperators} metas={metas} />;
        case 'daily':
          return <DailyPerformanceView operatorData={operatorData} registeredOperators={registeredOperators} />;
        case 'funnel':
          return <FunnelView operatorData={operatorData} registeredOperators={registeredOperators} />;
        case 'metas_tracking':
          return <MetasTrackingView operatorData={operatorData} registeredOperators={registeredOperators} metas={metas} />;
        case 'settings':
          return <SettingsView user={user} setCurrentUser={setCurrentUser} systemUsers={systemUsers} setSystemUsers={setSystemUsers} />;
        // case 'notifications':
        //   return <NotificationsView notifications={notifications} onNotificationRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))} onNotificationDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} onClearAll={() => setNotifications([])} />;
        case 'admin-messages':
          if (user.role === 'ADMIN') return <AdminMessagesView systemUsers={systemUsers} chatMessages={chatMessages} setChatMessages={setChatMessages} />;
          return <div className="p-8 text-center text-red-500 font-bold">Acesso Negado</div>;
        case 'cadastros':
          if (user.role === 'ADMIN') return <CadastrosView registeredOperators={registeredOperators} setRegisteredOperators={setRegisteredOperators} systemUsers={systemUsers} setSystemUsers={setSystemUsers} systemModules={systemModules} setSystemModules={setSystemModules} metas={metas} setMetas={setMetas} />;
          return <div className="p-8 text-center text-red-500 font-bold">Acesso Negado</div>;
        case 'insert':
          if (user.role === 'ADMIN') return <InsertDataView operatorData={operatorData} setOperatorData={setOperatorData} editingId={editingId} setEditingId={setEditingId} registeredOperators={registeredOperators} />;
          return <div className="p-8 text-center text-red-500 font-bold">Acesso Negado</div>;
        default:
          return <DashboardView operatorData={operatorData} registeredOperators={registeredOperators} metas={metas} />;
      }
    })();
    return <div className="animate-fade-in">{content}</div>;
  };

  const unreadMessagesCount = user.role === 'ADMIN' ? [...new Set(chatMessages.filter((m: any) => m.sender === 'user').map((m: any) => m.userId))].length : 0;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      {isMobileMenuOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-slate-900 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className={`flex items-center h-16 bg-slate-950 shrink-0 transition-all ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <ImpactoLogo className="w-8 h-8 text-blue-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-2xl lowercase leading-none tracking-tight">impacto</span>
                <span className="text-slate-400 font-medium text-[10px] leading-none text-right mt-0.5">Tecnologia</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <button className="hidden lg:block text-slate-400 hover:text-white" onClick={() => setIsCollapsed(false)} title="Expandir Menu">
              <Menu size={24} />
            </button>
          )}
          {!isCollapsed && (
            <button className="hidden lg:block text-slate-400 hover:text-white" onClick={() => setIsCollapsed(true)} title="Recolher Menu">
              <Menu size={20} />
            </button>
          )}
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar flex flex-col mt-1">
          <nav className="flex-1 flex flex-col">
            <div className="space-y-1">
              <button onClick={() => handleNavigation('dashboard')} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Dashboard" : ""}>
                <LayoutDashboard size={18} className="shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap font-medium">Dashboard</span>}
              </button>
              <button onClick={() => handleNavigation('daily')} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Desempenho Diário" : ""}>
                <BarChart2 size={18} className="shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap font-medium">Desempenho Diário</span>}
              </button>
              <button onClick={() => handleNavigation('funnel')} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'funnel' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Funil de Vendas" : ""}>
                <Filter size={18} className="shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap font-medium">Funil de Vendas</span>}
              </button>
              <button onClick={() => handleNavigation('metas_tracking')} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'metas_tracking' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Acompanhamento de Metas" : ""}>
                <Target size={18} className="shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap font-medium">Acompanhamento de Metas</span>}
              </button>
            </div>

            {user.role === 'ADMIN' && (
              <div className="pt-2 mt-2 border-t border-slate-800/50 space-y-1">
                {!isCollapsed && <p className="px-4 text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 whitespace-nowrap">Administração</p>}
                
                <button onClick={() => handleNavigation('admin-messages')} className={`w-full relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'admin-messages' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Caixa de Mensagens" : ""}>
                  <div className="relative">
                    <MessageSquare size={18} className="shrink-0" />
                    {unreadMessagesCount > 0 && isCollapsed && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="whitespace-nowrap font-medium">Caixa de Mensagens</span>
                      {unreadMessagesCount > 0 && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadMessagesCount}</span>
                      )}
                    </div>
                  )}
                </button>

                <button onClick={() => handleNavigation('cadastros')} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'cadastros' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Menu de Cadastros" : ""}>
                  <FolderPlus size={18} className="shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap font-medium">Cadastros</span>}
                </button>
                
                <button onClick={() => { setEditingId(null); handleNavigation('insert'); }} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'insert' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Inserir Dados" : ""}>
                  <ListPlus size={18} className="shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap font-medium">Inserir Dados</span>}
                </button>
              </div>
            )}

            <div className="mt-auto pt-2 space-y-1">
              {/* Notificações desativadas por enquanto */}
              <button onClick={() => handleNavigation('settings')} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 rounded-lg transition-colors text-xs ${currentView === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} title={isCollapsed ? "Configurações" : ""}>
                <SettingsIcon size={18} className="shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap font-medium">Configurações e Perfil</span>}
              </button>
            </div>
          </nav>
        </div>

        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/50 flex flex-col gap-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium">Acesso</span>
              <span className={`inline-block px-2 py-0.5 text-[8px] rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${user.role === 'ADMIN' ? 'bg-purple-900/80 text-purple-300 border border-purple-700' : 'bg-blue-900/80 text-blue-300 border border-blue-700'}`}>
                {user.role}
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center pb-1 border-b border-slate-800/80 mb-1">
              <span className={`inline-block px-1.5 py-0.5 text-[7px] rounded font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-900/80 text-purple-300 border border-purple-700' : 'bg-blue-900/80 text-blue-300 border border-blue-700'}`} title={`Acesso: ${user.role}`}>
                {user.role.substring(0, 3)}
              </span>
            </div>
          )}
          <button onClick={onLogout} className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2 text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors text-xs`} title={isCollapsed ? "Sair do Sistema" : ""}>
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap font-medium">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        <header className="lg:hidden bg-white shadow-sm border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ImpactoLogo className="w-7 h-7 text-blue-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-slate-900 font-extrabold text-xl lowercase leading-none tracking-tight">impacto</span>
              <span className="text-slate-500 font-medium text-[9px] leading-none text-right mt-0.5">Tecnologia</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500 hover:text-slate-700 shrink-0">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
          {renderContent()}
        </div>
      </main>

      {user.role !== 'ADMIN' && (
        <FloatingChatWidget 
          user={user} 
          adminUser={adminUser} 
          chatMessages={chatMessages} 
          setChatMessages={setChatMessages} 
        />
      )}
    </div>
  );
}

// ==========================================
// APLICAÇÃO PRINCIPAL
// ==========================================

export default function App() {
  // Inicializar currentUser a partir do localStorage se disponível
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('impacto_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [operatorData, setOperatorData] = useState(initialOperatorData);
  const [registeredOperators, setRegisteredOperators] = useState(initialRegisteredOperators);
  const [systemUsers, setSystemUsers] = useState(initialSystemUsers);
  const [systemModules, setSystemModules] = useState(initialSystemModules);
  const [metas, setMetas] = useState(initialMetas);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState<any[]>([]);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogin = (username: string, password: string) => {
    const foundUser = systemUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  // Salvar usuário no localStorage sempre que mudar
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('impacto_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('impacto_current_user');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('impacto_current_user');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <MainLayout 
        user={currentUser} 
        setCurrentUser={setCurrentUser}
        onLogout={handleLogout} 
        operatorData={operatorData}
        setOperatorData={setOperatorData}
        registeredOperators={registeredOperators}
        setRegisteredOperators={setRegisteredOperators}
        systemUsers={systemUsers}
        setSystemUsers={setSystemUsers}
        systemModules={systemModules}
        setSystemModules={setSystemModules}
        metas={metas}
        setMetas={setMetas}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}