import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type SessionStatus = 'connected' | 'replay' | 'error' | 'idle';

interface ConsoleSession {
  id: string;
  botId: string;
  botName: string;
  botInitial: string;
  runId: string;
  status: SessionStatus;
  mode: 'interactive' | 'replay';
  unreadCount: number;
  isPinned: boolean;
}

// Mock data for console sessions
const mockSessions: ConsoleSession[] = [
  { id: '1', botId: 'bot-erp-fatura', botName: 'Fatura ERP', botInitial: 'FE', runId: 'RUN-1024', status: 'connected', mode: 'interactive', unreadCount: 3, isPinned: true },
  { id: '2', botId: 'bot-relatorio-vendas', botName: 'Relatório Vendas', botInitial: 'RV', runId: 'RUN-1023', status: 'replay', mode: 'replay', unreadCount: 0, isPinned: false },
  { id: '3', botId: 'bot-backup-db', botName: 'Backup DB', botInitial: 'BD', runId: 'RUN-1022', status: 'error', mode: 'interactive', unreadCount: 1, isPinned: false },
  { id: '4', botId: 'bot-sync-api', botName: 'Sync API', botInitial: 'SA', runId: 'RUN-1021', status: 'connected', mode: 'interactive', unreadCount: 0, isPinned: false },
  { id: '5', botId: 'bot-email-sender', botName: 'Email Sender', botInitial: 'ES', runId: 'RUN-1020', status: 'idle', mode: 'replay', unreadCount: 0, isPinned: false },
];

const statusColors: Record<SessionStatus, string> = {
  connected: 'ring-success',
  replay: 'ring-primary',
  error: 'ring-destructive',
  idle: 'ring-muted-foreground',
};

const statusBg: Record<SessionStatus, string> = {
  connected: 'bg-success',
  replay: 'bg-primary',
  error: 'bg-destructive',
  idle: 'bg-muted-foreground',
};

interface ChatHeadsProps {
  onSelectSession?: (session: ConsoleSession) => void;
  activeSessionId?: string;
  collapsed?: boolean;
}

export function ChatHeads({ onSelectSession, activeSessionId, collapsed }: ChatHeadsProps) {
  const [sessions, setSessions] = useState<ConsoleSession[]>(mockSessions);
  const [showOverflow, setShowOverflow] = useState(false);
  
  const MAX_VISIBLE = 6;
  const visibleSessions = sessions.slice(0, MAX_VISIBLE);
  const overflowSessions = sessions.slice(MAX_VISIBLE);

  const handleRemoveSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleSelectSession = (session: ConsoleSession) => {
    onSelectSession?.(session);
    // Clear unread count when selected
    setSessions(prev => 
      prev.map(s => s.id === session.id ? { ...s, unreadCount: 0 } : s)
    );
  };

  if (sessions.length === 0 || collapsed) return null;

  return (
    <div className="fixed left-16 top-20 z-40 flex flex-col gap-2 p-2">
      {visibleSessions.map((session) => (
        <Tooltip key={session.id} delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleSelectSession(session)}
              className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200",
                "ring-2 ring-offset-2 ring-offset-background",
                statusColors[session.status],
                activeSessionId === session.id 
                  ? "bg-primary text-primary-foreground scale-110" 
                  : "bg-card text-card-foreground hover:scale-105 hover:bg-accent"
              )}
            >
              {session.botInitial}
              
              {/* Status dot */}
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                statusBg[session.status]
              )} />
              
              {/* Unread badge */}
              {session.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                  {session.unreadCount > 9 ? '9+' : session.unreadCount}
                </span>
              )}
              
              {/* Close button on hover */}
              <span 
                onClick={(e) => handleRemoveSession(e, session.id)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-opacity"
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-popover text-popover-foreground">
            <div className="space-y-1">
              <p className="font-medium">{session.botName}</p>
              <p className="text-xs text-muted-foreground">
                {session.runId} • {session.mode === 'interactive' ? 'Interativo' : 'Replay'}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
      
      {/* Overflow indicator */}
      {overflowSessions.length > 0 && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowOverflow(!showOverflow)}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all",
                "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              +{overflowSessions.length}
              <ChevronDown className={cn(
                "w-3 h-3 ml-0.5 transition-transform",
                showOverflow && "rotate-180"
              )} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-popover text-popover-foreground">
            <p>Mais {overflowSessions.length} consoles</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      {/* Overflow menu */}
      {showOverflow && overflowSessions.length > 0 && (
        <div className="absolute left-14 top-0 bg-popover border border-border rounded-lg shadow-lg p-2 space-y-1 min-w-48">
          {overflowSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => {
                handleSelectSession(session);
                setShowOverflow(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-left transition-colors"
            >
              <span className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ring-2",
                statusColors[session.status],
                "bg-card text-card-foreground"
              )}>
                {session.botInitial}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{session.botName}</p>
                <p className="text-xs text-muted-foreground">{session.runId}</p>
              </div>
              {session.unreadCount > 0 && (
                <span className="min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {session.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}