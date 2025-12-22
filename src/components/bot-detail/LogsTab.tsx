import { useState } from "react";
import { Terminal, Table, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsoleTab } from "./ConsoleTab";
import { LogsTableTab } from "./LogsTableTab";
import { LogsConfigTab } from "./LogsConfigTab";

interface LogsTabProps {
  botName?: string;
  botId?: string;
}

export function LogsTab({ botName = "Fatura ERP", botId = "bot-erp-fatura" }: LogsTabProps) {
  return (
    <Tabs defaultValue="console" className="space-y-4">
      <TabsList className="bg-card border border-border">
        <TabsTrigger value="console" className="gap-2 text-xs md:text-sm">
          <Terminal className="h-4 w-4" />
          Console
        </TabsTrigger>
        <TabsTrigger value="tabela" className="gap-2 text-xs md:text-sm">
          <Table className="h-4 w-4" />
          Tabela
        </TabsTrigger>
        <TabsTrigger value="config" className="gap-2 text-xs md:text-sm">
          <Settings className="h-4 w-4" />
          Config
        </TabsTrigger>
      </TabsList>

      <TabsContent value="console" className="animate-fade-in mt-0">
        <ConsoleTab botName={botName} botId={botId} />
      </TabsContent>
      
      <TabsContent value="tabela" className="animate-fade-in mt-0">
        <LogsTableTab />
      </TabsContent>
      
      <TabsContent value="config" className="animate-fade-in mt-0">
        <LogsConfigTab />
      </TabsContent>
    </Tabs>
  );
}