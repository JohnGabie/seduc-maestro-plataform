import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const botSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(50, 'Nome muito longo'),
  descricao: z.string().max(200, 'Descrição muito longa').optional(),
  tipo: z.string().optional(),
  tags: z.string().optional(),
});

type BotFormData = z.infer<typeof botSchema>;

interface NewBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormErrors {
  nome?: string;
  descricao?: string;
}

export function NewBotModal({ open, onOpenChange }: NewBotModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<BotFormData>({
    nome: '',
    descricao: '',
    tipo: '',
    tags: '',
  });

  const validateField = (field: keyof BotFormData, value: string) => {
    try {
      botSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  };

  const handleChange = (field: keyof BotFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'nome' || field === 'descricao') {
      validateField(field, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = botSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      toast.error('Corrija os erros do formulário');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    toast.success('Bot criado com sucesso!', {
      description: `${formData.nome} está pronto para configuração.`,
    });

    // Reset form and close
    setFormData({ nome: '', descricao: '', tipo: '', tags: '' });
    setErrors({});
    onOpenChange(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setErrors({});
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Novo Bot</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Configure seu novo bot de automação
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Bot *</Label>
            <Input
              id="nome"
              placeholder="Ex: Bot Gerador de Relatórios"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className={`bg-input border-border ${errors.nome ? 'border-destructive' : ''}`}
            />
            {errors.nome && (
              <p className="text-sm text-destructive animate-fade-in">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva a função deste bot..."
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              className={`bg-input border-border resize-none ${errors.descricao ? 'border-destructive' : ''}`}
              rows={3}
            />
            {errors.descricao && (
              <p className="text-sm text-destructive animate-fade-in">{errors.descricao}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Bot</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => handleChange('tipo', value)}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="scraper">Web Scraper</SelectItem>
                <SelectItem value="api">Integração API</SelectItem>
                <SelectItem value="report">Gerador de Relatórios</SelectItem>
                <SelectItem value="sync">Sincronização de Dados</SelectItem>
                <SelectItem value="notification">Notificações</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Ex: financeiro, relatórios (separadas por vírgula)"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="bg-input border-border"
            />
            <p className="text-xs text-muted-foreground">
              Adicione tags para facilitar a organização
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Bot'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
