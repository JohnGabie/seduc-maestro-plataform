import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard de Bots</h1>
        <p className="text-muted-foreground">Em construção — Fase 2</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Voltar ao Login
        </Button>
      </div>
    </div>
  );
}
