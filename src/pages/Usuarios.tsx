import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search,
  MoreHorizontal,
  Mail,
  Shield,
  Clock,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Crown,
  Briefcase,
  Wrench,
  Eye
} from 'lucide-react';
import { AppSidebar, MobileMenuButton } from '@/components/AppSidebar';
import { AppBar } from '@/components/AppBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  mockUsers, 
  User, 
  UserRole,
  roleLabels, 
  roleDescriptions,
  roleColors,
  permissionLabels,
  defaultRolePermissions
} from '@/data/mockUsers';
import { EditUserModal } from '@/components/EditUserModal';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  Ativo: { color: 'bg-success/10 text-success border-success/20', icon: UserCheck },
  Inativo: { color: 'bg-muted text-muted-foreground border-border', icon: UserX },
  Pendente: { color: 'bg-warning/10 text-warning border-warning/20', icon: Clock }
};

const roleIcons = {
  admin: Crown,
  gerente: Briefcase,
  operador: Wrench,
  visualizador: Eye
};

export default function Usuarios() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('todos');
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ nome: '', email: '', cargo: '', role: 'visualizador' as UserRole });
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.cargo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const activeCount = users.filter(u => u.status === 'Ativo').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const handleAddUser = () => {
    if (!newUser.nome || !newUser.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e email do usuário.",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      nome: newUser.nome,
      email: newUser.email,
      cargo: newUser.cargo || 'Usuário',
      status: 'Pendente',
      ultimoAcesso: null,
      role: newUser.role,
      permissoes: defaultRolePermissions[newUser.role],
      dataCriacao: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [user, ...prev]);
    setNewUser({ nome: '', email: '', cargo: '', role: 'visualizador' });
    setIsNewUserOpen(false);

    toast({
      title: "Usuário convidado",
      description: `Convite enviado para ${user.email}`
    });
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast({
      title: "Usuário atualizado",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'Ativo' ? 'Inativo' : 'Ativo';
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso."
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getCustomPermissionsCount = (user: User) => {
    const defaultPerms = defaultRolePermissions[user.role];
    const added = user.permissoes.filter(p => !defaultPerms.includes(p)).length;
    const removed = defaultPerms.filter(p => !user.permissoes.includes(p)).length;
    return { added, removed };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppBar
          title="Usuários"
          leftContent={<MobileMenuButton onClick={() => setMobileOpen(true)} />}
        />
        
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{users.length}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-success/10">
                    <UserCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                    <p className="text-sm text-muted-foreground">Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-destructive/10">
                    <Crown className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{adminCount}</p>
                    <p className="text-sm text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-warning/10">
                    <Shield className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">4</p>
                    <p className="text-sm text-muted-foreground">Roles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <Card className="bg-card border-border">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background border-input"
                    />
                  </div>

                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[180px] bg-background border-input">
                      <SelectValue placeholder="Filtrar por role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as roles</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="operador">Operador</SelectItem>
                      <SelectItem value="visualizador">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Convidar Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Convidar Novo Usuário</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Envie um convite por email para adicionar um novo membro à equipe.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome" className="text-foreground">Nome</Label>
                        <Input
                          id="nome"
                          value={newUser.nome}
                          onChange={(e) => setNewUser(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Nome completo"
                          className="bg-background border-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="email@empresa.com"
                          className="bg-background border-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cargo" className="text-foreground">Cargo</Label>
                        <Input
                          id="cargo"
                          value={newUser.cargo}
                          onChange={(e) => setNewUser(prev => ({ ...prev, cargo: e.target.value }))}
                          placeholder="Ex: Analista de Automação"
                          className="bg-background border-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Role</Label>
                        <Select 
                          value={newUser.role} 
                          onValueChange={(v) => setNewUser(prev => ({ ...prev, role: v as UserRole }))}
                        >
                          <SelectTrigger className="bg-background border-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(roleLabels) as UserRole[]).map(role => (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center gap-2">
                                  <span>{roleLabels[role]}</span>
                                  <span className="text-xs text-muted-foreground">- {roleDescriptions[role]}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          As permissões podem ser personalizadas após o cadastro.
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewUserOpen(false)} className="border-border">
                        Cancelar
                      </Button>
                      <Button onClick={handleAddUser} className="bg-primary text-primary-foreground">
                        Enviar Convite
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* User List */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map(user => {
                const status = statusConfig[user.status];
                const StatusIcon = status.icon;
                const RoleIcon = roleIcons[user.role];
                const customPerms = getCustomPermissionsCount(user);
                const hasCustomPerms = customPerms.added > 0 || customPerms.removed > 0;

                return (
                  <Card key={user.id} className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(user.nome)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <h3 className="font-medium text-foreground truncate">{user.nome}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn('w-fit', status.color)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            <span className="text-sm text-muted-foreground">{user.cargo}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className={cn('cursor-help', roleColors[user.role])}>
                                  <RoleIcon className="h-3 w-3 mr-1" />
                                  {roleLabels[user.role]}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover text-popover-foreground border-border">
                                <p>{roleDescriptions[user.role]}</p>
                              </TooltipContent>
                            </Tooltip>

                            {hasCustomPerms && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground cursor-help">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Permissões customizadas
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover text-popover-foreground border-border">
                                  <p>
                                    {customPerms.added > 0 && `+${customPerms.added} permissão(ões) extra`}
                                    {customPerms.added > 0 && customPerms.removed > 0 && ', '}
                                    {customPerms.removed > 0 && `-${customPerms.removed} permissão(ões) removida`}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            <span className="text-xs text-muted-foreground">
                              {user.permissoes.length} permissões
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">
                            {user.ultimoAcesso ? `Último acesso: ${user.ultimoAcesso}` : 'Nunca acessou'}
                          </span>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => setEditingUser(user)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => toggleUserStatus(user.id)}
                              >
                                {user.status === 'Ativo' ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </main>
      </div>

      <EditUserModal 
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSave={handleSaveUser}
      />
    </div>
  );
}
