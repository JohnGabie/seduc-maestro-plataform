import { useState } from 'react';
import { Settings, Bell, Shield, Database, Trash2, Loader2, Check } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const configSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(50, 'Nome muito longo'),
  descricao: z.string().max(200, 'Descrição muito longa'),
  timeout: z.number().min(1, 'Mínimo 1 minuto').max(120, 'Máximo 120 minutos'),
  maxRetries: z.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
  logRetention: z.number().min(7, 'Mínimo 7 dias').max(90, 'Máximo 90 dias'),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface FormErrors {
  nome?: string;
  descricao?: string;
  timeout?: string;
  maxRetries?: string;
  logRetention?: string;
}

export function ConfiguracoesTab() {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<ConfigFormData>({
    nome: 'Bot - Fatura ERP',
    descricao: 'Processa faturas do sistema ERP para conciliação',
    timeout: 30,
    maxRetries: 3,
    logRetention: 30,
  });

  const [notifications, setNotifications] = useState({
    onError: true,
    onComplete: false,
    onLongRun: true,
  });

  const [retryEnabled, setRetryEnabled] = useState(true);

  const validateField = (field: keyof ConfigFormData, value: string | number) => {
    try {
      const schema = configSchema.shape[field];
      schema.parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
      }
      return false;
    }
  };

  const handleChange = (field: keyof ConfigFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const handleSave = async () => {
    const result = configSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      toast.error('Corrija os erros antes de salvar');
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      {/* General Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Configurações Gerais</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Nome do Bot</Label>
            <Input
              id="bot-name"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className={`bg-background border-border ${errors.nome ? 'border-destructive' : ''}`}
            />
            {errors.nome && (
              <p className="text-sm text-destructive animate-fade-in">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-desc">Descrição</Label>
            <Input
              id="bot-desc"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              className={`bg-background border-border ${errors.descricao ? 'border-destructive' : ''}`}
            />
            {errors.descricao && (
              <p className="text-sm text-destructive animate-fade-in">{errors.descricao}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Timeout de Execução</Label>
              <p className="text-sm text-muted-foreground">Tempo máximo em minutos (1-120)</p>
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                value={formData.timeout}
                onChange={(e) => handleChange('timeout', parseInt(e.target.value) || 0)}
                className={`w-20 bg-background border-border ${errors.timeout ? 'border-destructive' : ''}`}
              />
              {errors.timeout && (
                <p className="text-xs text-destructive animate-fade-in">{errors.timeout}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-lg border border-border p-6">
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
            <Switch
              checked={notifications.onError}
              onCheckedChange={(checked) => setNotifications({ ...notifications, onError: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Notificar execução concluída</Label>
              <p className="text-sm text-muted-foreground">Envia confirmação ao finalizar</p>
            </div>
            <Switch
              checked={notifications.onComplete}
              onCheckedChange={(checked) => setNotifications({ ...notifications, onComplete: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Notificar execução longa</Label>
              <p className="text-sm text-muted-foreground">Alerta se exceder o tempo esperado</p>
            </div>
            <Switch
              checked={notifications.onLongRun}
              onCheckedChange={(checked) => setNotifications({ ...notifications, onLongRun: checked })}
            />
          </div>
        </div>
      </div>

      {/* Retry Policy */}
      <div className="bg-card rounded-lg border border-border p-6">
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
            <Switch checked={retryEnabled} onCheckedChange={setRetryEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Número máximo de tentativas</Label>
              <p className="text-sm text-muted-foreground">Quantidade de retentativas (1-10)</p>
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                value={formData.maxRetries}
                onChange={(e) => handleChange('maxRetries', parseInt(e.target.value) || 0)}
                disabled={!retryEnabled}
                className={`w-20 bg-background border-border ${errors.maxRetries ? 'border-destructive' : ''}`}
              />
              {errors.maxRetries && (
                <p className="text-xs text-destructive animate-fade-in">{errors.maxRetries}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Gerenciamento de Dados</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Retenção de Logs</Label>
              <p className="text-sm text-muted-foreground">Dias para manter logs (7-90)</p>
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                value={formData.logRetention}
                onChange={(e) => handleChange('logRetention', parseInt(e.target.value) || 0)}
                className={`w-20 bg-background border-border ${errors.logRetention ? 'border-destructive' : ''}`}
              />
              {errors.logRetention && (
                <p className="text-xs text-destructive animate-fade-in">{errors.logRetention}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 rounded-lg border border-destructive/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold text-destructive">Zona de Perigo</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Ações irreversíveis. Tenha certeza antes de prosseguir.
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => toast.warning('Histórico será limpo em breve...')}
          >
            Limpar Histórico
          </Button>
          <Button
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => toast.error('Bot será excluído permanentemente!')}
          >
            Excluir Bot
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => toast.info('Alterações descartadas')}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
