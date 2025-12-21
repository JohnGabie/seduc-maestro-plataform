export type UserRole = 'admin' | 'gerente' | 'operador' | 'visualizador';

export type Permission = 
  | 'bots.criar'
  | 'bots.editar'
  | 'bots.excluir'
  | 'bots.executar'
  | 'bots.visualizar'
  | 'agenda.editar'
  | 'agenda.visualizar'
  | 'logs.visualizar'
  | 'logs.exportar'
  | 'usuarios.gerenciar'
  | 'configuracoes.editar'
  | 'alertas.gerenciar';

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  ultimoAcesso: string | null;
  role: UserRole;
  permissoes: Permission[];
  dataCriacao: string;
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  operador: 'Operador',
  visualizador: 'Visualizador'
};

export const roleDescriptions: Record<UserRole, string> = {
  admin: 'Acesso total ao sistema',
  gerente: 'Gerencia bots e equipe',
  operador: 'Executa e monitora bots',
  visualizador: 'Apenas visualização'
};

export const roleColors: Record<UserRole, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  gerente: 'bg-primary/10 text-primary border-primary/20',
  operador: 'bg-info/10 text-info border-info/20',
  visualizador: 'bg-muted text-muted-foreground border-border'
};

export const permissionLabels: Record<Permission, string> = {
  'bots.criar': 'Criar Bots',
  'bots.editar': 'Editar Bots',
  'bots.excluir': 'Excluir Bots',
  'bots.executar': 'Executar Bots',
  'bots.visualizar': 'Visualizar Bots',
  'agenda.editar': 'Editar Agenda',
  'agenda.visualizar': 'Visualizar Agenda',
  'logs.visualizar': 'Visualizar Logs',
  'logs.exportar': 'Exportar Logs',
  'usuarios.gerenciar': 'Gerenciar Usuários',
  'configuracoes.editar': 'Editar Configurações',
  'alertas.gerenciar': 'Gerenciar Alertas'
};

export const permissionCategories = {
  bots: ['bots.criar', 'bots.editar', 'bots.excluir', 'bots.executar', 'bots.visualizar'] as Permission[],
  agenda: ['agenda.editar', 'agenda.visualizar'] as Permission[],
  logs: ['logs.visualizar', 'logs.exportar'] as Permission[],
  sistema: ['usuarios.gerenciar', 'configuracoes.editar', 'alertas.gerenciar'] as Permission[]
};

export const defaultRolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'bots.criar', 'bots.editar', 'bots.excluir', 'bots.executar', 'bots.visualizar',
    'agenda.editar', 'agenda.visualizar',
    'logs.visualizar', 'logs.exportar',
    'usuarios.gerenciar', 'configuracoes.editar', 'alertas.gerenciar'
  ],
  gerente: [
    'bots.criar', 'bots.editar', 'bots.executar', 'bots.visualizar',
    'agenda.editar', 'agenda.visualizar',
    'logs.visualizar', 'logs.exportar',
    'alertas.gerenciar'
  ],
  operador: [
    'bots.executar', 'bots.visualizar',
    'agenda.visualizar',
    'logs.visualizar'
  ],
  visualizador: [
    'bots.visualizar',
    'agenda.visualizar',
    'logs.visualizar'
  ]
};

export const mockUsers: User[] = [
  {
    id: "user-1",
    nome: "Carlos Silva",
    email: "carlos.silva@empresa.com",
    cargo: "Diretor de TI",
    status: "Ativo",
    ultimoAcesso: "Hoje 14:32",
    role: "admin",
    permissoes: defaultRolePermissions.admin,
    dataCriacao: "2023-06-15"
  },
  {
    id: "user-2",
    nome: "Ana Santos",
    email: "ana.santos@empresa.com",
    cargo: "Gerente de Automação",
    status: "Ativo",
    ultimoAcesso: "Hoje 11:45",
    role: "gerente",
    permissoes: defaultRolePermissions.gerente,
    dataCriacao: "2023-08-22"
  },
  {
    id: "user-3",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    cargo: "Analista de Automação",
    status: "Ativo",
    ultimoAcesso: "Ontem 18:20",
    role: "operador",
    permissoes: [...defaultRolePermissions.operador, 'bots.editar'],
    dataCriacao: "2023-09-10"
  },
  {
    id: "user-4",
    nome: "Maria Costa",
    email: "maria.costa@empresa.com",
    cargo: "Coordenadora de RPA",
    status: "Ativo",
    ultimoAcesso: "Hoje 09:15",
    role: "gerente",
    permissoes: [...defaultRolePermissions.gerente, 'usuarios.gerenciar'],
    dataCriacao: "2023-05-01"
  },
  {
    id: "user-5",
    nome: "João Ferreira",
    email: "joao.ferreira@empresa.com",
    cargo: "Estagiário",
    status: "Pendente",
    ultimoAcesso: null,
    role: "visualizador",
    permissoes: defaultRolePermissions.visualizador,
    dataCriacao: "2024-01-10"
  },
  {
    id: "user-6",
    nome: "Lucia Mendes",
    email: "lucia.mendes@empresa.com",
    cargo: "Analista de Dados",
    status: "Inativo",
    ultimoAcesso: "10/12/2023",
    role: "operador",
    permissoes: defaultRolePermissions.operador,
    dataCriacao: "2023-07-20"
  }
];
