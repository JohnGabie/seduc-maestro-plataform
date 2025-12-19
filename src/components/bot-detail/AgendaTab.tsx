import { useState } from "react";
import { Plus, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSchedule, ScheduleSlot } from "@/data/mockLogs";

const diasSemana = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terça' },
  { key: 'qua', label: 'Quarta' },
  { key: 'qui', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
] as const;

export function AgendaTab() {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(mockSchedule);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const getSlotsByDay = (dia: string) => {
    return schedule.filter(s => s.dia === dia && s.ativo);
  };

  const toggleSlot = (id: string) => {
    setSelectedSlot(selectedSlot === id ? null : id);
  };

  const removeSlot = (id: string) => {
    setSchedule(schedule.map(s => s.id === id ? { ...s, ativo: false } : s));
    setSelectedSlot(null);
  };

  const hasSchedules = schedule.some(s => s.ativo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Grade Semanal</h3>
          <p className="text-sm text-muted-foreground">Clique em um horário para editar ou remover.</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar horário
        </Button>
      </div>

      {/* Schedule Grid */}
      {hasSchedules ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {diasSemana.map(dia => {
            const slots = getSlotsByDay(dia.key);
            if (slots.length === 0) return null;
            
            return (
              <div key={dia.key} className="bg-card rounded-lg border border-border p-4">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {dia.label}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {slots.map(slot => (
                    <Badge
                      key={slot.id}
                      variant={selectedSlot === slot.id ? "default" : "secondary"}
                      className="cursor-pointer transition-all hover:scale-105 relative group"
                      onClick={() => toggleSlot(slot.id)}
                    >
                      {slot.horario}
                      {selectedSlot === slot.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSlot(slot.id);
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Sem horários configurados — adicione um</p>
          <Button size="sm" variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Adicionar horário
          </Button>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Feriados</h4>
          <p className="text-sm text-muted-foreground">Nenhum feriado configurado</p>
          <Button variant="ghost" size="sm" className="mt-2 text-primary">
            Configurar feriados
          </Button>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Janela de Manutenção</h4>
          <p className="text-sm text-muted-foreground">Sem janela de manutenção ativa</p>
          <Button variant="ghost" size="sm" className="mt-2 text-primary">
            Definir janela
          </Button>
        </div>
      </div>
    </div>
  );
}
