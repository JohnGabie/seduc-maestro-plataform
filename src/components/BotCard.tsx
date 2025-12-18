import { Play, Clock, Timer, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bot } from '@/data/mockBots';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BotCardProps {
  bot: Bot;
  onExecute: (bot: Bot) => void;
}

const statusStyles = {
  Ativo: 'bg-success/20 text-success border-success/30',
  Pausado: 'bg-warning/20 text-warning border-warning/30',
  Erro: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function BotCard({ bot, onExecute }: BotCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/bots/${bot.id}`);
  };

  const handleExecuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExecute(bot);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-card border border-border rounded-xl p-5 space-y-4 hover:border-primary/30 transition-colors cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{bot.nome}</h3>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
              statusStyles[bot.status]
            )}
          >
            {bot.status}
          </span>
        </div>
        <Button
          size="sm"
          onClick={handleExecuteClick}
          className="flex-shrink-0"
        >
          <Play className="h-4 w-4 mr-1.5" />
          Executar
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Próxima</span>
          </div>
          <p className="text-foreground font-medium">
            {bot.proximaExecucao || '—'}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Última</span>
          </div>
          <p className="text-foreground font-medium">
            {bot.ultimaExecucao || '—'}
          </p>
        </div>
        <div className="space-y-1 col-span-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            <span>Duração média</span>
          </div>
          <p className="text-foreground font-medium">{bot.duracaoMedia}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
        {bot.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-xs px-2 py-0.5 bg-muted text-muted-foreground"
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
