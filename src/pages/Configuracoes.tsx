import { useState } from "react";
import { AppSidebar, MobileMenuButton } from "@/components/AppSidebar";
import { AppBar } from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Mail,
  Smartphone,
} from "lucide-react";

export default function Configuracoes() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    nome: "Admin",
    email: "admin@empresa.com",
    telefone: "(11) 99999-9999",
  });

  const [notifications, setNotifications] = useState({
    emailExecucao: true,
    emailErro: true,
    pushExecucao: false,
    pushErro: true,
  });

  const [preferences, setPreferences] = useState({
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    retencaoLogs: "30",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col">
        <AppBar
          title="Configurações"
          showSearch={false}
          leftContent={<MobileMenuButton onClick={() => setMobileMenuOpen(true)} />}
        />

        <main className="flex-1 p-4 md:p-6 animate-page-in">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Perfil</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={profile.nome}
                    onChange={e => setProfile({ ...profile, nome: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={profile.telefone}
                    onChange={e => setProfile({ ...profile, telefone: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Notificações</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Email</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-exec" className="text-sm text-muted-foreground">
                        Notificar ao concluir execução
                      </Label>
                      <Switch
                        id="email-exec"
                        checked={notifications.emailExecucao}
                        onCheckedChange={checked =>
                          setNotifications({ ...notifications, emailExecucao: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-error" className="text-sm text-muted-foreground">
                        Notificar em caso de erro
                      </Label>
                      <Switch
                        id="email-error"
                        checked={notifications.emailErro}
                        onCheckedChange={checked =>
                          setNotifications({ ...notifications, emailErro: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Push</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-exec" className="text-sm text-muted-foreground">
                        Notificar ao concluir execução
                      </Label>
                      <Switch
                        id="push-exec"
                        checked={notifications.pushExecucao}
                        onCheckedChange={checked =>
                          setNotifications({ ...notifications, pushExecucao: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-error" className="text-sm text-muted-foreground">
                        Notificar em caso de erro
                      </Label>
                      <Switch
                        id="push-error"
                        checked={notifications.pushErro}
                        onCheckedChange={checked =>
                          setNotifications({ ...notifications, pushErro: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Preferências</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={preferences.idioma}
                    onValueChange={value => setPreferences({ ...preferences, idioma: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={value => setPreferences({ ...preferences, timezone: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Data Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Dados</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Retenção de Logs</Label>
                  <Select
                    value={preferences.retencaoLogs}
                    onValueChange={value =>
                      setPreferences({ ...preferences, retencaoLogs: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Logs mais antigos serão excluídos automaticamente
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
