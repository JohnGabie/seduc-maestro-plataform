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
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';

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

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavigate = (url: string) => {
    navigate(url);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50',
          // Desktop
          'hidden lg:flex',
          collapsed ? 'lg:w-16' : 'lg:w-60',
          // Mobile
          mobileOpen && 'fixed inset-y-0 left-0 flex w-60 lg:relative'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {(!collapsed || mobileOpen) && (
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
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hidden lg:flex"
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
                onClick={() => handleNavigate(item.url)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span className="text-sm font-medium">{item.title}</span>}
              </button>
            );

            if (collapsed && !mobileOpen) {
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
        <div className="p-2 border-t border-sidebar-border space-y-1">
          {/* Theme Toggle */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <Moon className="h-5 w-5 flex-shrink-0" />
                )}
                {(!collapsed || mobileOpen) && (
                  <span className="text-sm font-medium">
                    {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && !mobileOpen && (
              <TooltipContent side="right" className="bg-popover text-popover-foreground">
                {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Logout */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleNavigate('/')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span className="text-sm font-medium">Sair</span>}
              </button>
            </TooltipTrigger>
            {collapsed && !mobileOpen && (
              <TooltipContent side="right" className="bg-popover text-popover-foreground">
                Sair
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="lg:hidden h-9 w-9 text-foreground"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
