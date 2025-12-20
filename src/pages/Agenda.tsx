import { useState, useMemo } from "react";
import { AppSidebar, MobileMenuButton } from "@/components/AppSidebar";
import { AppBar } from "@/components/AppBar";
import { mockBots, Bot } from "@/data/mockBots";
import { mockSchedule, ScheduleSlot } from "@/data/mockLogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Play,
  Bot as BotIcon,
  CheckCircle,
  PauseCircle,
  AlertCircle,
} from "lucide-react";

const diasSemana = [
  { key: "seg", label: "Segunda" },
  { key: "ter", label: "Terça" },
  { key: "qua", label: "Quarta" },
  { key: "qui", label: "Quinta" },
  { key: "sex", label: "Sexta" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
];

const statusConfig = {
  Ativo: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  Pausado: { icon: PauseCircle, color: "text-warning", bg: "bg-warning/10" },
  Erro: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

interface ScheduleItem {
  bot: Bot;
  slot: ScheduleSlot;
}

export default function Agenda() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Combine bots with schedule data
  const scheduleItems = useMemo<ScheduleItem[]>(() => {
    const activeBots = mockBots.filter(b => b.status === "Ativo");
    return mockSchedule
      .filter(slot => slot.ativo)
      .map(slot => ({
        bot: activeBots[Math.floor(Math.random() * activeBots.length)] || mockBots[0],
        slot,
      }));
  }, []);

  const filteredItems = useMemo(() => {
    if (!selectedDay) return scheduleItems;
    return scheduleItems.filter(item => item.slot.dia === selectedDay);
  }, [scheduleItems, selectedDay]);

  const groupedByDay = useMemo(() => {
    const grouped: Record<string, ScheduleItem[]> = {};
    filteredItems.forEach(item => {
      if (!grouped[item.slot.dia]) {
        grouped[item.slot.dia] = [];
      }
      grouped[item.slot.dia].push(item);
    });
    // Sort by time within each day
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.slot.horario.localeCompare(b.slot.horario));
    });
    return grouped;
  }, [filteredItems]);

  const stats = useMemo(() => ({
    total: scheduleItems.length,
    hoje: scheduleItems.filter(i => i.slot.dia === "seg").length, // Example
    ativos: mockBots.filter(b => b.status === "Ativo").length,
  }), [scheduleItems]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col">
        <AppBar
          title="Agenda"
          showSearch={false}
          leftContent={<MobileMenuButton onClick={() => setMobileMenuOpen(true)} />}
        />

        <main className="flex-1 p-4 md:p-6 animate-page-in">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Total Agendado</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Execuções Hoje</span>
              </div>
              <p className="text-2xl font-bold text-primary">{stats.hoje}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-success mb-1">
                <BotIcon className="h-4 w-4" />
                <span className="text-sm">Bots Ativos</span>
              </div>
              <p className="text-2xl font-bold text-success">{stats.ativos}</p>
            </div>
          </div>

          {/* Day Filter */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDay === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="border-border"
              >
                Todos
              </Button>
              {diasSemana.map(dia => (
                <Button
                  key={dia.key}
                  variant={selectedDay === dia.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(dia.key)}
                  className="border-border"
                >
                  {dia.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="space-y-6">
            {diasSemana
              .filter(dia => !selectedDay || dia.key === selectedDay)
              .filter(dia => groupedByDay[dia.key]?.length > 0)
              .map(dia => (
                <div key={dia.key} className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{dia.label}</h3>
                      <Badge variant="secondary">
                        {groupedByDay[dia.key]?.length || 0} execuções
                      </Badge>
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {groupedByDay[dia.key]?.map((item, idx) => {
                      const config = statusConfig[item.bot.status];
                      const StatusIcon = config.icon;

                      return (
                        <div
                          key={`${item.slot.id}-${idx}`}
                          className="p-4 hover:bg-muted/30 transition-colors flex items-center gap-4"
                        >
                          {/* Time */}
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm font-medium text-foreground">
                              {item.slot.horario}
                            </span>
                          </div>

                          {/* Bot Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {item.bot.nome}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusIcon className={`h-3 w-3 ${config.color}`} />
                              <span className={`text-xs ${config.color}`}>
                                {item.bot.status}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • Duração: {item.bot.duracaoMedia}
                              </span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="hidden md:flex gap-1">
                            {item.bot.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Actions */}
                          <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

            {filteredItems.length === 0 && (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nenhuma execução agendada</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
