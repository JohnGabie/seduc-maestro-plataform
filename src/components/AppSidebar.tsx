import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bot,
  Calendar,
  Play,
  FileText,
  Settings,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Bots', url: '/bots', icon: Bot },
  { title: 'Agenda', url: '/agenda', icon: Calendar },
  { title: 'Execuções', url: '/execucoes', icon: Play },
  { title: 'Logs', url: '/logs', icon: FileText },
  { title: 'Configurações', url: '/configuracoes', icon: Settings },
  { title: 'Usuários', url: '/usuarios', icon: Users },
  { title: 'Alertas', url: '/alertas', icon: Bell },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-sidebar-foreground">Maestro</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-dark">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);

          const button = (
            <button
              key={item.url}
              onClick={() => navigate(item.url)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
            </button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.url} delayDuration={0}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Sair</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="bg-popover text-popover-foreground">
              Sair
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}
