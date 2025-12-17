import { useState } from 'react';
import { Play, Loader2, Bug, Zap, RotateCcw } from 'lucide-react';
import { Bot } from '@/data/mockBots';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ExecuteModalProps {
  bot: Bot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExecuteModal({ bot, open, onOpenChange }: ExecuteModalProps) {
  const [forceRerun, setForceRerun] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success(`${bot?.nome} iniciado com sucesso!`, {
      description: 'A execução foi adicionada à fila.',
    });
    
    setIsExecuting(false);
    onOpenChange(false);
    
    // Reset options
    setForceRerun(false);
    setDebugMode(false);
    setHighPriority(false);
  };

  if (!bot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Executar Agora</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Confirme a execução imediata do bot selecionado.
          </DialogDescription>
        </DialogHeader>

        {/* Bot Summary */}
        <div className="bg-secondary rounded-lg p-4 space-y-2">
          <p className="font-medium text-foreground">{bot.nome}</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Última execução: {bot.ultimaExecucao || 'Nunca'}</p>
            <p>Duração média: {bot.duracaoMedia}</p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Opções de execução</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="force-rerun"
                checked={forceRerun}
                onCheckedChange={(checked) => setForceRerun(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="force-rerun" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                  Forçar reexecução
                </Label>
                <p className="text-xs text-muted-foreground">
                  Executa mesmo se já houver uma instância em andamento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={(checked) => setDebugMode(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="debug-mode" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                  <Bug className="h-4 w-4 text-muted-foreground" />
                  Modo debug
                </Label>
                <p className="text-xs text-muted-foreground">
                  Gera logs detalhados para diagnóstico
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="high-priority"
                checked={highPriority}
                onCheckedChange={(checked) => setHighPriority(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="high-priority" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  Prioridade alta
                </Label>
                <p className="text-xs text-muted-foreground">
                  Coloca na frente da fila de execução
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExecuting}
            className="border-border"
          >
            Cancelar
          </Button>
          <Button onClick={handleExecute} disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Executar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
