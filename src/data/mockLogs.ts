export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  details?: string;
}

export interface ExecutionHistory {
  id: string;
  dataHora: string;
  status: 'Sucesso' | 'Falha' | 'Cancelado';
  duracao: string;
  registrosProcessados?: number;
  erro?: string;
}

export const mockLogs: LogEntry[] = [
  { id: "log-1", timestamp: "2024-12-17 18:00:02", level: "info", message: "Iniciando execução do bot", details: "Versão 2.1.0" },
  { id: "log-2", timestamp: "2024-12-17 18:00:03", level: "info", message: "Conectando ao banco de dados ERP" },
  { id: "log-3", timestamp: "2024-12-17 18:00:05", level: "info", message: "Conexão estabelecida com sucesso" },
  { id: "log-4", timestamp: "2024-12-17 18:00:08", level: "info", message: "Buscando faturas pendentes", details: "Período: últimos 7 dias" },
  { id: "log-5", timestamp: "2024-12-17 18:00:15", level: "info", message: "Encontradas 45 faturas para processamento" },
  { id: "log-6", timestamp: "2024-12-17 18:02:30", level: "warn", message: "Fatura #12345 com dados incompletos", details: "Campo CNPJ vazio - usando valor padrão" },
  { id: "log-7", timestamp: "2024-12-17 18:05:00", level: "info", message: "Processamento de faturas concluído", details: "44 sucessos, 1 com avisos" },
  { id: "log-8", timestamp: "2024-12-17 18:05:02", level: "info", message: "Gerando relatório de execução" },
  { id: "log-9", timestamp: "2024-12-17 18:05:05", level: "info", message: "Execução finalizada com sucesso", details: "Duração total: 5m 03s" },
  { id: "log-10", timestamp: "2024-12-17 12:00:02", level: "info", message: "Iniciando execução do bot" },
  { id: "log-11", timestamp: "2024-12-17 12:00:10", level: "error", message: "Falha na conexão com o banco de dados", details: "Timeout após 5 tentativas" },
  { id: "log-12", timestamp: "2024-12-17 12:00:12", level: "error", message: "Execução abortada", details: "Erro crítico - verificar conectividade" },
];

export const mockHistory: ExecutionHistory[] = [
  { id: "exec-1", dataHora: "17/12/2024 18:00", status: "Sucesso", duracao: "5m 03s", registrosProcessados: 45 },
  { id: "exec-2", dataHora: "17/12/2024 12:00", status: "Falha", duracao: "0m 12s", erro: "Timeout na conexão" },
  { id: "exec-3", dataHora: "16/12/2024 18:00", status: "Sucesso", duracao: "4m 58s", registrosProcessados: 38 },
  { id: "exec-4", dataHora: "16/12/2024 12:00", status: "Sucesso", duracao: "5m 15s", registrosProcessados: 42 },
  { id: "exec-5", dataHora: "15/12/2024 18:00", status: "Cancelado", duracao: "2m 30s" },
  { id: "exec-6", dataHora: "15/12/2024 12:00", status: "Sucesso", duracao: "5m 02s", registrosProcessados: 40 },
  { id: "exec-7", dataHora: "14/12/2024 18:00", status: "Sucesso", duracao: "4m 45s", registrosProcessados: 35 },
  { id: "exec-8", dataHora: "14/12/2024 12:00", status: "Sucesso", duracao: "5m 10s", registrosProcessados: 41 },
];

// Chart data for performance visualization
export const chartData = {
  executionTrend: [
    { date: "10/12", sucesso: 2, falha: 0 },
    { date: "11/12", sucesso: 2, falha: 1 },
    { date: "12/12", sucesso: 2, falha: 0 },
    { date: "13/12", sucesso: 2, falha: 0 },
    { date: "14/12", sucesso: 2, falha: 0 },
    { date: "15/12", sucesso: 1, falha: 0 },
    { date: "16/12", sucesso: 2, falha: 0 },
    { date: "17/12", sucesso: 1, falha: 1 },
  ],
  durationTrend: [
    { date: "10/12", duracao: 4.8 },
    { date: "11/12", duracao: 5.2 },
    { date: "12/12", duracao: 4.9 },
    { date: "13/12", duracao: 5.0 },
    { date: "14/12", duracao: 4.9 },
    { date: "15/12", duracao: 5.0 },
    { date: "16/12", duracao: 5.1 },
    { date: "17/12", duracao: 5.0 },
  ],
  recordsTrend: [
    { date: "10/12", registros: 38 },
    { date: "11/12", registros: 42 },
    { date: "12/12", registros: 35 },
    { date: "13/12", registros: 40 },
    { date: "14/12", registros: 38 },
    { date: "15/12", registros: 40 },
    { date: "16/12", registros: 40 },
    { date: "17/12", registros: 45 },
  ],
};

export interface ScheduleSlot {
  id: string;
  dia: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
  horario: string;
  ativo: boolean;
}

export const mockSchedule: ScheduleSlot[] = [
  { id: "sch-1", dia: "seg", horario: "06:00", ativo: true },
  { id: "sch-2", dia: "seg", horario: "12:00", ativo: true },
  { id: "sch-3", dia: "seg", horario: "18:00", ativo: true },
  { id: "sch-4", dia: "ter", horario: "06:00", ativo: true },
  { id: "sch-5", dia: "ter", horario: "12:00", ativo: true },
  { id: "sch-6", dia: "ter", horario: "18:00", ativo: true },
  { id: "sch-7", dia: "qua", horario: "06:00", ativo: true },
  { id: "sch-8", dia: "qua", horario: "12:00", ativo: false },
  { id: "sch-9", dia: "qua", horario: "18:00", ativo: true },
  { id: "sch-10", dia: "qui", horario: "06:00", ativo: true },
  { id: "sch-11", dia: "qui", horario: "12:00", ativo: true },
  { id: "sch-12", dia: "qui", horario: "18:00", ativo: true },
  { id: "sch-13", dia: "sex", horario: "06:00", ativo: true },
  { id: "sch-14", dia: "sex", horario: "12:00", ativo: true },
  { id: "sch-15", dia: "sex", horario: "18:00", ativo: true },
];
