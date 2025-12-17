import { useState, useMemo, useCallback } from 'react';
import { Plus, Filter, Bot as BotIcon } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppBar } from '@/components/AppBar';
import { BotCard } from '@/components/BotCard';
import { ExecuteModal } from '@/components/ExecuteModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockBots, allTags, Bot } from '@/data/mockBots';

type StatusFilter = 'Ativo' | 'Pausado' | 'Erro';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [statusFilters, setStatusFilters] = useState<StatusFilter[]>([]);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [executeModalOpen, setExecuteModalOpen] = useState(false);

  // Debounced search (simple implementation)
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    // Simple debounce
    const timeout = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timeout);
  }, []);

  // Filter bots
  const filteredBots = useMemo(() => {
    return mockBots.filter((bot) => {
      // Search filter
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch =
        !debouncedSearch ||
        bot.nome.toLowerCase().includes(searchLower) ||
        bot.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // Status filter
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(bot.status);

      // Tag filter
      const matchesTags =
        tagFilters.length === 0 ||
        bot.tags.some((tag) => tagFilters.includes(tag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  }, [debouncedSearch, statusFilters, tagFilters]);

  const handleExecute = (bot: Bot) => {
    setSelectedBot(bot);
    setExecuteModalOpen(true);
  };

  const toggleStatusFilter = (status: StatusFilter) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleTagFilter = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeFiltersCount = statusFilters.length + tagFilters.length;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppBar searchValue={search} onSearchChange={handleSearchChange} />
        
        <main className="flex-1 p-6 overflow-auto scrollbar-dark">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo bot
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover border-border">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes('Ativo')}
                    onCheckedChange={() => toggleStatusFilter('Ativo')}
                  >
                    Ativo
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes('Pausado')}
                    onCheckedChange={() => toggleStatusFilter('Pausado')}
                  >
                    Pausado
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes('Erro')}
                    onCheckedChange={() => toggleStatusFilter('Erro')}
                  >
                    Erro
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel>Tags</DropdownMenuLabel>
                  {allTags.map((tag) => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={tagFilters.includes(tag)}
                      onCheckedChange={() => toggleTagFilter(tag)}
                    >
                      #{tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-muted-foreground">
              {filteredBots.length} bot{filteredBots.length !== 1 ? 's' : ''} encontrado{filteredBots.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Bots Grid or Empty State */}
          {filteredBots.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredBots.map((bot) => (
                <BotCard key={bot.id} bot={bot} onExecute={handleExecute} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BotIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum bot encontrado
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {debouncedSearch || activeFiltersCount > 0
                  ? 'Tente ajustar os filtros ou termo de busca.'
                  : 'Comece criando seu primeiro bot para automatizar suas tarefas.'}
              </p>
              {!debouncedSearch && activeFiltersCount === 0 && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo bot
                </Button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Execute Modal */}
      <ExecuteModal
        bot={selectedBot}
        open={executeModalOpen}
        onOpenChange={setExecuteModalOpen}
      />
    </div>
  );
}
