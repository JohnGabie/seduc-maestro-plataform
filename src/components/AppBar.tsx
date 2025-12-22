import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { mockUsers, roleLabels, roleColors } from '@/data/mockUsers';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AppBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
  showSearch?: boolean;
  leftContent?: ReactNode;
}

export function AppBar({ 
  searchValue = "", 
  onSearchChange, 
  title = "Bots",
  showSearch = true,
  leftContent
}: AppBarProps) {
  const { currentUser, setCurrentUser } = usePermissions();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 gap-4">
      <div className="flex items-center gap-3">
        {leftContent}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {showSearch && onSearchChange && (
          <div className="relative w-full max-w-xs sm:max-w-sm md:w-80 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-10 bg-secondary border-border"
            />
          </div>
        )}

        {/* User Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {currentUser ? getInitials(currentUser.nome) : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-foreground">
                {currentUser?.nome?.split(' ')[0] || 'Selecionar'}
              </span>
              <Badge 
                variant="outline" 
                className={cn('text-[10px] px-1.5 py-0', currentUser && roleColors[currentUser.role])}
              >
                {currentUser ? roleLabels[currentUser.role] : '-'}
              </Badge>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-popover border-border">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Simular usuário (demo)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockUsers.filter(u => u.status === 'Ativo').map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className={cn(
                  'flex items-center gap-3 cursor-pointer',
                  currentUser?.id === user.id && 'bg-muted'
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(user.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.nome}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn('text-[10px] px-1.5 py-0', roleColors[user.role])}
                    >
                      {roleLabels[user.role]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {user.permissoes.length} permissões
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
