import { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, Filter, Bot as BotIcon } from 'lucide-react';
import { AppSidebar, MobileMenuButton } from '@/components/AppSidebar';
import { AppBar } from '@/components/AppBar';
import { BotCard } from '@/components/BotCard';
import { BotCardSkeleton } from '@/components/BotCardSkeleton';
import { ExecuteModal } from '@/components/ExecuteModal';
import { NewBotModal } from '@/components/NewBotModal';
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
  const [newBotModalOpen, setNewBotModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timeout);
  }, []);

  // Filter bots
  const filteredBots = useMemo(() => {
    return mockBots.filter((bot) => {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch =
        !debouncedSearch ||
        bot.nome.toLowerCase().includes(searchLower) ||
        bot.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(bot.status);

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
      <AppSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppBar 
          searchValue={search} 
          onSearchChange={handleSearchChange}
          leftContent={<MobileMenuButton onClick={() => setMobileMenuOpen(true)} />}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto scrollbar-dark animate-page-in">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button onClick={() => setNewBotModalOpen(true)} className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:inline">Novo bot</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-border">
                    <Filter className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Filtros</span>
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

          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <BotCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBots.length > 0 ? (
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
                <Button onClick={() => setNewBotModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo bot
                </Button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ExecuteModal
        bot={selectedBot}
        open={executeModalOpen}
        onOpenChange={setExecuteModalOpen}
      />
      <NewBotModal
        open={newBotModalOpen}
        onOpenChange={setNewBotModalOpen}
      />
    </div>
  );
}
