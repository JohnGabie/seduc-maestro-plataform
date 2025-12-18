import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AppBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
  showSearch?: boolean;
}

export function AppBar({ 
  searchValue = "", 
  onSearchChange, 
  title = "Bots",
  showSearch = true 
}: AppBarProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      
      {showSearch && onSearchChange && (
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar bots, agendas, execuções..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-secondary border-border"
          />
        </div>
      )}
    </header>
  );
}
