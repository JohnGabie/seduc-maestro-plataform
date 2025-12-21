export interface Alert {
  id: string;
  tipo: 'erro' | 'aviso' | 'sucesso' | 'info';
  titulo: string;
  mensagem: string;
  botId?: string;
  botNome?: string;
  dataHora: string;
  lida: boolean;
}

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    tipo: "erro",
    titulo: "Falha na execução",
    mensagem: "O bot 'Conciliação Bancária' falhou ao conectar com o banco de dados. Verifique as credenciais.",
    botId: "bot-concil",
    botNome: "Bot - Conciliação Bancária",
    dataHora: "2024-01-15T14:32:00",
    lida: false
  },
  {
    id: "alert-2",
    tipo: "aviso",
    titulo: "Execução lenta detectada",
    mensagem: "O bot 'Folha de Pagamento' está demorando mais que o esperado. Tempo atual: 1h 23m.",
    botId: "bot-folha",
    botNome: "Bot - Folha de Pagamento",
    dataHora: "2024-01-15T12:15:00",
    lida: false
  },
  {
    id: "alert-3",
    tipo: "sucesso",
    titulo: "Execução concluída",
    mensagem: "O bot 'Fatura ERP' foi executado com sucesso. 156 registros processados.",
    botId: "bot-erp-fatura",
    botNome: "Bot - Fatura ERP",
    dataHora: "2024-01-15T12:03:00",
    lida: true
  },
  {
    id: "alert-4",
    tipo: "info",
    titulo: "Manutenção programada",
    mensagem: "Sistema entrará em manutenção às 02:00 do dia 16/01. Duração estimada: 30 minutos.",
    dataHora: "2024-01-15T10:00:00",
    lida: true
  },
  {
    id: "alert-5",
    tipo: "erro",
    titulo: "Timeout na conexão",
    mensagem: "O bot 'Emissão NF-e' não conseguiu completar a requisição. Timeout após 60 segundos.",
    botId: "bot-nfe",
    botNome: "Bot - Emissão NF-e",
    dataHora: "2024-01-14T16:45:00",
    lida: true
  },
  {
    id: "alert-6",
    tipo: "aviso",
    titulo: "Limite de requisições",
    mensagem: "Você está próximo do limite de 10.000 requisições mensais. Atualmente: 8.750 requisições.",
    dataHora: "2024-01-14T09:30:00",
    lida: true
  },
  {
    id: "alert-7",
    tipo: "sucesso",
    titulo: "Backup concluído",
    mensagem: "Backup diário realizado com sucesso. Tamanho total: 2.4 GB.",
    botId: "bot-backup",
    botNome: "Bot - Backup Diário",
    dataHora: "2024-01-13T23:30:00",
    lida: true
  }
];
