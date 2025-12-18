import { Settings, Bell, Shield, Database, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function ConfiguracoesTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* General Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Configurações Gerais</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Nome do Bot</Label>
            <Input 
              id="bot-name" 
              defaultValue="Bot - Fatura ERP" 
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bot-desc">Descrição</Label>
            <Input 
              id="bot-desc" 
              defaultValue="Processa faturas do sistema ERP para conciliação" 
              className="bg-background border-border"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Timeout de Execução</Label>
              <p className="text-sm text-muted-foreground">Tempo máximo de execução em minutos</p>
            </div>
            <Input 
              type="number" 
              defaultValue="30" 
              className="w-20 bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Notificações</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificar em caso de erro</Label>
              <p className="text-sm text-muted-foreground">Envia alerta quando a execução falhar</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificar execução concluída</Label>
              <p className="text-sm text-muted-foreground">Envia confirmação ao finalizar</p>
            </div>
            <Switch />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificar execução longa</Label>
              <p className="text-sm text-muted-foreground">Alerta se exceder o tempo esperado</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Retry Policy */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Política de Retry</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Retentar em caso de falha</Label>
              <p className="text-sm text-muted-foreground">Tenta executar novamente automaticamente</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Número máximo de tentativas</Label>
              <p className="text-sm text-muted-foreground">Quantidade de retentativas antes de desistir</p>
            </div>
            <Input 
              type="number" 
              defaultValue="3" 
              className="w-20 bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Gerenciamento de Dados</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Retenção de Logs</Label>
              <p className="text-sm text-muted-foreground">Dias para manter logs de execução</p>
            </div>
            <Input 
              type="number" 
              defaultValue="30" 
              className="w-20 bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-status-error/5 rounded-lg border border-status-error/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="h-5 w-5 text-status-error" />
          <h3 className="font-semibold text-status-error">Zona de Perigo</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Ações irreversíveis. Tenha certeza antes de prosseguir.
        </p>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-status-error/50 text-status-error hover:bg-status-error/10">
            Limpar Histórico
          </Button>
          <Button variant="outline" className="border-status-error/50 text-status-error hover:bg-status-error/10">
            Excluir Bot
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
}
