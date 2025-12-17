export interface Bot {
  id: string;
  nome: string;
  status: 'Ativo' | 'Pausado' | 'Erro';
  proximaExecucao: string | null;
  ultimaExecucao: string | null;
  duracaoMedia: string;
  tags: string[];
}

export const mockBots: Bot[] = [
  {
    id: "bot-erp-fatura",
    nome: "Bot - Fatura ERP",
    status: "Ativo",
    proximaExecucao: "Hoje 18:00",
    ultimaExecucao: "Hoje 12:03",
    duracaoMedia: "12m",
    tags: ["financeiro", "etl"]
  },
  {
    id: "bot-concil",
    nome: "Bot - Conciliação Bancária",
    status: "Erro",
    proximaExecucao: null,
    ultimaExecucao: "Ontem 23:48",
    duracaoMedia: "9m",
    tags: ["financeiro", "concil"]
  },
  {
    id: "bot-folha",
    nome: "Bot - Folha de Pagamento",
    status: "Ativo",
    proximaExecucao: "Amanhã 06:00",
    ultimaExecucao: "Hoje 06:02",
    duracaoMedia: "45m",
    tags: ["rh", "folha"]
  },
  {
    id: "bot-nfe",
    nome: "Bot - Emissão NF-e",
    status: "Pausado",
    proximaExecucao: null,
    ultimaExecucao: "15/12 14:30",
    duracaoMedia: "8m",
    tags: ["fiscal", "nfe"]
  },
  {
    id: "bot-backup",
    nome: "Bot - Backup Diário",
    status: "Ativo",
    proximaExecucao: "Hoje 23:00",
    ultimaExecucao: "Ontem 23:00",
    duracaoMedia: "25m",
    tags: ["infra", "backup"]
  }
];

export const allTags = ["financeiro", "etl", "concil", "rh", "folha", "fiscal", "nfe", "infra", "backup"];
