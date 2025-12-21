import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  UserRole, 
  Permission,
  roleLabels, 
  roleDescriptions,
  permissionLabels, 
  permissionCategories,
  defaultRolePermissions
} from '@/data/mockUsers';
import { Bot, Calendar, FileText, Settings, Shield } from 'lucide-react';

interface EditUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

const categoryIcons = {
  bots: Bot,
  agenda: Calendar,
  logs: FileText,
  sistema: Settings
};

const categoryLabels = {
  bots: 'Bots',
  agenda: 'Agenda',
  logs: 'Logs',
  sistema: 'Sistema'
};

export function EditUserModal({ user, open, onOpenChange, onSave }: EditUserModalProps) {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [customPermissions, setCustomPermissions] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
      // Check if permissions differ from default role permissions
      const defaultPerms = defaultRolePermissions[user.role];
      const hasCustom = user.permissoes.length !== defaultPerms.length ||
        !user.permissoes.every(p => defaultPerms.includes(p));
      setCustomPermissions(hasCustom);
    }
  }, [user]);

  if (!editedUser) return null;

  const handleRoleChange = (role: UserRole) => {
    setEditedUser(prev => prev ? {
      ...prev,
      role,
      permissoes: customPermissions ? prev.permissoes : defaultRolePermissions[role]
    } : null);
  };

  const togglePermission = (permission: Permission) => {
    setEditedUser(prev => {
      if (!prev) return null;
      const has = prev.permissoes.includes(permission);
      return {
        ...prev,
        permissoes: has 
          ? prev.permissoes.filter(p => p !== permission)
          : [...prev.permissoes, permission]
      };
    });
  };

  const handleSave = () => {
    if (editedUser) {
      onSave(editedUser);
      onOpenChange(false);
    }
  };

  const applyDefaultPermissions = () => {
    setEditedUser(prev => prev ? {
      ...prev,
      permissoes: defaultRolePermissions[prev.role]
    } : null);
    setCustomPermissions(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Usuário</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Altere as informações e permissões do usuário.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="info" className="data-[state=active]:bg-background">
              Informações
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-background">
              Permissões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome" className="text-foreground">Nome</Label>
              <Input
                id="edit-nome"
                value={editedUser.nome}
                onChange={(e) => setEditedUser(prev => prev ? { ...prev, nome: e.target.value } : null)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-foreground">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cargo" className="text-foreground">Cargo</Label>
              <Input
                id="edit-cargo"
                value={editedUser.cargo}
                onChange={(e) => setEditedUser(prev => prev ? { ...prev, cargo: e.target.value } : null)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Role</Label>
              <Select value={editedUser.role} onValueChange={(v) => handleRoleChange(v as UserRole)}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(roleLabels) as UserRole[]).map(role => (
                    <SelectItem key={role} value={role}>
                      <div className="flex flex-col">
                        <span>{roleLabels[role]}</span>
                        <span className="text-xs text-muted-foreground">{roleDescriptions[role]}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Role: {roleLabels[editedUser.role]}
                </span>
              </div>
              {customPermissions && (
                <Button variant="ghost" size="sm" onClick={applyDefaultPermissions}>
                  Restaurar padrão
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                id="custom-perms" 
                checked={customPermissions}
                onCheckedChange={(checked) => {
                  setCustomPermissions(!!checked);
                  if (!checked) {
                    setEditedUser(prev => prev ? {
                      ...prev,
                      permissoes: defaultRolePermissions[prev.role]
                    } : null);
                  }
                }}
              />
              <Label htmlFor="custom-perms" className="text-sm text-foreground cursor-pointer">
                Personalizar permissões
              </Label>
            </div>

            <div className="space-y-4">
              {(Object.keys(permissionCategories) as (keyof typeof permissionCategories)[]).map(category => {
                const Icon = categoryIcons[category];
                const permissions = permissionCategories[category];

                return (
                  <div key={category} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{categoryLabels[category]}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permissions.map(permission => {
                        const hasPermission = editedUser.permissoes.includes(permission);
                        const isDefault = defaultRolePermissions[editedUser.role].includes(permission);

                        return (
                          <div key={permission} className="flex items-center gap-2">
                            <Checkbox
                              id={permission}
                              checked={hasPermission}
                              disabled={!customPermissions}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <Label 
                              htmlFor={permission} 
                              className={`text-sm cursor-pointer flex items-center gap-2 ${
                                !customPermissions ? 'text-muted-foreground' : 'text-foreground'
                              }`}
                            >
                              {permissionLabels[permission]}
                              {customPermissions && hasPermission !== isDefault && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {hasPermission ? '+' : '-'}
                                </Badge>
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
