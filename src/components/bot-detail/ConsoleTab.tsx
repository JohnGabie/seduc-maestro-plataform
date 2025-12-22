import { useState, useRef, useEffect, useCallback } from "react";
import {
  Terminal,
  Wifi,
  WifiOff,
  Loader2,
  Send,
  Trash2,
  Copy,
  Download,
  X,
  Play,
  Table,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

type ConsoleStatus = 'unavailable' | 'disconnected' | 'connecting' | 'interactive' | 'replay' | 'ended';
type ConsoleMode = 'interactive' | 'replay';

interface LogLine {
  id: string;
  timestamp: string;
  content: string;
  type: 'stdout' | 'stderr' | 'input' | 'system';
}

interface ConsoleTabProps {
  botName: string;
  botId: string;
}

// Mock log data
const mockConsoleLogs: LogLine[] = [
  { id: '1', timestamp: '14:32:01', content: '[INFO] Iniciando processamento de faturas...', type: 'stdout' },
  { id: '2', timestamp: '14:32:02', content: '[INFO] Conectando ao ERP...', type: 'stdout' },
  { id: '3', timestamp: '14:32:03', content: '[INFO] Autenticação bem-sucedida', type: 'stdout' },
  { id: '4', timestamp: '14:32:05', content: '[INFO] Buscando faturas pendentes...', type: 'stdout' },
  { id: '5', timestamp: '14:32:08', content: '[INFO] 47 faturas encontradas', type: 'stdout' },
  { id: '6', timestamp: '14:32:10', content: '[WARN] Fatura #1234 com data retroativa', type: 'stderr' },
  { id: '7', timestamp: '14:32:12', content: '[INFO] Processando fatura 1/47...', type: 'stdout' },
  { id: '8', timestamp: '14:32:15', content: '[INFO] Processando fatura 2/47...', type: 'stdout' },
];

const statusConfig = {
  unavailable: { 
    label: 'Indisponível', 
    color: 'bg-muted text-muted-foreground',
    icon: WifiOff 
  },
  disconnected: { 
    label: 'Desconectado', 
    color: 'bg-muted text-muted-foreground',
    icon: WifiOff 
  },
  connecting: { 
    label: 'Conectando...', 
    color: 'bg-warning/20 text-warning',
    icon: Loader2 
  },
  interactive: { 
    label: 'Conectado', 
    color: 'bg-success/20 text-success',
    icon: Wifi 
  },
  replay: { 
    label: 'Replay', 
    color: 'bg-primary/20 text-primary',
    icon: Play 
  },
  ended: { 
    label: 'Encerrado', 
    color: 'bg-muted text-muted-foreground',
    icon: WifiOff 
  },
};

export function ConsoleTab({ botName, botId }: ConsoleTabProps) {
  const [status, setStatus] = useState<ConsoleStatus>('disconnected');
  const [mode, setMode] = useState<ConsoleMode>('interactive');
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [runId] = useState('RUN-1024');
  const [isRuntimeAvailable] = useState(true); // Simulated
  
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Handle scroll to detect manual scroll
  const handleScroll = useCallback(() => {
    if (outputRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  }, []);

  const handleConnect = () => {
    if (!isRuntimeAvailable) {
      toast.error('Runtime indisponível. Tente quando o robô estiver online.');
      return;
    }
    
    setStatus('connecting');
    // Simulate connection
    setTimeout(() => {
      setStatus('interactive');
      setMode('interactive');
      setLogs(mockConsoleLogs);
      toast.success('Conectado ao console');
    }, 1500);
  };

  const handleReplay = () => {
    setStatus('connecting');
    setTimeout(() => {
      setStatus('replay');
      setMode('replay');
      setLogs(mockConsoleLogs);
      toast.info(`Reproduzindo execução ${runId}`);
    }, 1000);
  };

  const handleDisconnect = () => {
    setStatus('ended');
    toast.info(`Sessão encerrada — ${runId}`);
  };

  const handleSendInput = () => {
    if (!inputValue.trim()) return;
    
    const newLog: LogLine = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      content: `> ${inputValue}`,
      type: 'input',
    };
    
    setLogs(prev => [...prev, newLog]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setLogs([]);
    toast.info('Console limpo');
  };

  const handleCopy = async () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.content}`).join('\n');
    await navigator.clipboard.writeText(text);
    toast.success('Logs copiados para a área de transferência');
  };

  const handleDownload = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.content}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botId}-${runId}.log`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Log baixado');
  };

  const StatusIcon = statusConfig[status].icon;

  // Render different states
  const renderContent = () => {
    // Unavailable state
    if (!isRuntimeAvailable && status === 'disconnected') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-full console-surface flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 console-text-secondary" />
          </div>
          <div className="text-center space-y-2">
            <p className="console-text-primary font-medium">Runtime indisponível</p>
            <p className="console-text-secondary text-sm">Conexão não permitida agora.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleReplay}>
            <Play className="h-4 w-4" />
            Ver últimos logs
          </Button>
        </div>
      );
    }

    // Disconnected/Idle state
    if (status === 'disconnected') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-full console-surface flex items-center justify-center">
            <Terminal className="w-8 h-8 console-text-secondary" />
          </div>
          <div className="text-center space-y-2">
            <p className="console-text-primary font-medium">Console desconectado</p>
            <p className="console-text-secondary text-sm">Conecte para interagir com o bot.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="gap-2" onClick={handleConnect}>
              <Wifi className="h-4 w-4" />
              Conectar
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleReplay}>
              <Play className="h-4 w-4" />
              Reproduzir última
            </Button>
          </div>
        </div>
      );
    }

    // Connecting state
    if (status === 'connecting') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <Loader2 className="w-12 h-12 console-accent animate-spin" />
          <p className="console-text-primary font-medium">Conectando ao bot…</p>
        </div>
      );
    }

    // Connected/Replay/Ended - Show logs
    return (
      <>
        {/* Output area */}
        <div 
          ref={outputRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto console-scrollbar p-4 font-mono text-sm space-y-1"
          aria-live="polite"
        >
          {status === 'replay' && (
            <div className="console-text-secondary text-xs mb-4 pb-2 border-b console-border">
              Mostrando a última execução ({runId})
            </div>
          )}
          {status === 'ended' && (
            <div className="console-text-secondary text-xs mb-4 pb-2 border-b console-border">
              Sessão encerrada — {runId}
            </div>
          )}
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`flex gap-3 ${
                log.type === 'stderr' ? 'console-error' : 
                log.type === 'input' ? 'console-accent' : 
                log.type === 'system' ? 'console-text-secondary' :
                'console-text-primary'
              }`}
            >
              <span className="console-text-secondary flex-shrink-0">{log.timestamp}</span>
              <span className="break-all">{log.content}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="console-text-secondary text-center py-8">
              Aguardando saída do console...
            </div>
          )}
        </div>

        {/* Auto-scroll indicator */}
        {!autoScroll && (status === 'interactive' || status === 'replay') && (
          <button
            onClick={() => {
              setAutoScroll(true);
              if (outputRef.current) {
                outputRef.current.scrollTop = outputRef.current.scrollHeight;
              }
            }}
            className="absolute bottom-20 right-4 px-3 py-1.5 rounded-full console-surface console-text-secondary text-xs hover:text-primary transition-colors"
          >
            ↓ Auto-scroll pausado
          </button>
        )}
      </>
    );
  };

  return (
    <div className="console-bg rounded-lg border console-border flex flex-col h-[500px] relative overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 console-surface border-b console-border">
        <div className="flex items-center gap-3 text-xs">
          <span className="console-text-secondary">Bot:</span>
          <span className="console-text-primary font-medium">{botName}</span>
          <span className="console-text-secondary">•</span>
          <span className="console-text-secondary">Execução:</span>
          <span className="console-text-primary">{runId}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`text-xs gap-1.5 ${statusConfig[status].color}`}>
            <StatusIcon className={`h-3 w-3 ${status === 'connecting' ? 'animate-spin' : ''}`} />
            {statusConfig[status].label}
          </Badge>
          {(status === 'interactive' || status === 'replay') && (
            <Badge variant="outline" className="text-xs console-text-secondary">
              {mode === 'interactive' ? 'Interativo' : 'Replay'}
            </Badge>
          )}
        </div>
      </div>

      {/* Console content */}
      {renderContent()}

      {/* Input prompt - Only in interactive mode */}
      {status === 'interactive' && (
        <div className="flex items-center gap-2 px-4 py-3 border-t console-border console-surface">
          <span className="console-accent font-mono text-sm">{'>'}</span>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendInput()}
            placeholder="Digite um comando..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 console-text-primary font-mono text-sm placeholder:console-text-secondary"
          />
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleSendInput}
            className="console-text-primary hover:console-accent"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Toolbar */}
      {(status === 'interactive' || status === 'replay' || status === 'ended') && (
        <div className="flex items-center justify-between px-4 py-2 border-t console-border console-surface">
          <div className="flex gap-1">
            {status === 'interactive' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={handleClear} className="console-text-secondary hover:console-text-primary">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Limpar</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={handleCopy} className="console-text-secondary hover:console-text-primary">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copiar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={handleDownload} className="console-text-secondary hover:console-text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Baixar log</TooltipContent>
            </Tooltip>
            {status === 'replay' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" className="console-text-secondary hover:console-text-primary">
                    <Table className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Abrir na tabela</TooltipContent>
              </Tooltip>
            )}
          </div>
          {status === 'interactive' && (
            <Button size="sm" variant="ghost" onClick={handleDisconnect} className="text-destructive hover:text-destructive gap-1.5">
              <X className="h-4 w-4" />
              Finalizar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}