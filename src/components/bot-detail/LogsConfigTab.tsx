import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function LogsConfigTab() {
  const [config, setConfig] = useState({
    enableDebugLogs: false,
    logRetentionDays: '30',
    maxLogSize: '100',
    enableRemoteLogging: true,
    logLevel: 'info',
  });

  const handleSave = () => {
    toast.success('Configurações de log salvas');
  };

  const handleReset = () => {
    setConfig({
      enableDebugLogs: false,
      logRetentionDays: '30',
      maxLogSize: '100',
      enableRemoteLogging: true,
      logLevel: 'info',
    });
    toast.info('Configurações restauradas para o padrão');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Configurações de Logs</h3>
        
        {/* Log Level */}
        <div className="space-y-2">
          <Label>Nível de Log</Label>
          <Select 
            value={config.logLevel} 
            onValueChange={(value) => setConfig({ ...config, logLevel: value })}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Define o nível mínimo de logs a serem capturados.</p>
        </div>

        {/* Debug Logs */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Logs de Debug</Label>
            <p className="text-xs text-muted-foreground">Habilitar logs detalhados para debugging.</p>
          </div>
          <Switch 
            checked={config.enableDebugLogs}
            onCheckedChange={(checked) => setConfig({ ...config, enableDebugLogs: checked })}
          />
        </div>

        {/* Remote Logging */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Logging Remoto</Label>
            <p className="text-xs text-muted-foreground">Enviar logs para servidor central.</p>
          </div>
          <Switch 
            checked={config.enableRemoteLogging}
            onCheckedChange={(checked) => setConfig({ ...config, enableRemoteLogging: checked })}
          />
        </div>

        {/* Retention Days */}
        <div className="space-y-2">
          <Label>Retenção de Logs (dias)</Label>
          <Input 
            type="number" 
            value={config.logRetentionDays}
            onChange={(e) => setConfig({ ...config, logRetentionDays: e.target.value })}
            className="w-full max-w-xs"
          />
          <p className="text-xs text-muted-foreground">Tempo que os logs serão mantidos antes de serem excluídos.</p>
        </div>

        {/* Max Log Size */}
        <div className="space-y-2">
          <Label>Tamanho Máximo do Log (MB)</Label>
          <Input 
            type="number" 
            value={config.maxLogSize}
            onChange={(e) => setConfig({ ...config, maxLogSize: e.target.value })}
            className="w-full max-w-xs"
          />
          <p className="text-xs text-muted-foreground">Tamanho máximo de cada arquivo de log.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Restaurar Padrão
        </Button>
      </div>
    </div>
  );
}