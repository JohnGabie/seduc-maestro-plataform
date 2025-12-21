export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  ultimoAcesso: string | null;
  permissoes: ('admin' | 'editor' | 'viewer')[];
  dataCriacao: string;
}

export const mockUsers: User[] = [
  {
    id: "user-1",
    nome: "Carlos Silva",
    email: "carlos.silva@empresa.com",
    cargo: "Administrador",
    status: "Ativo",
    ultimoAcesso: "Hoje 14:32",
    permissoes: ["admin"],
    dataCriacao: "2023-06-15"
  },
  {
    id: "user-2",
    nome: "Ana Santos",
    email: "ana.santos@empresa.com",
    cargo: "Analista de Automação",
    status: "Ativo",
    ultimoAcesso: "Hoje 11:45",
    permissoes: ["editor"],
    dataCriacao: "2023-08-22"
  },
  {
    id: "user-3",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    cargo: "Desenvolvedor",
    status: "Ativo",
    ultimoAcesso: "Ontem 18:20",
    permissoes: ["editor", "viewer"],
    dataCriacao: "2023-09-10"
  },
  {
    id: "user-4",
    nome: "Maria Costa",
    email: "maria.costa@empresa.com",
    cargo: "Gerente de TI",
    status: "Ativo",
    ultimoAcesso: "Hoje 09:15",
    permissoes: ["admin", "editor"],
    dataCriacao: "2023-05-01"
  },
  {
    id: "user-5",
    nome: "João Ferreira",
    email: "joao.ferreira@empresa.com",
    cargo: "Estagiário",
    status: "Pendente",
    ultimoAcesso: null,
    permissoes: ["viewer"],
    dataCriacao: "2024-01-10"
  },
  {
    id: "user-6",
    nome: "Lucia Mendes",
    email: "lucia.mendes@empresa.com",
    cargo: "Analista de Dados",
    status: "Inativo",
    ultimoAcesso: "10/12/2023",
    permissoes: ["viewer"],
    dataCriacao: "2023-07-20"
  }
];

export const permissionLabels: Record<string, string> = {
  admin: "Administrador",
  editor: "Editor",
  viewer: "Visualizador"
};
