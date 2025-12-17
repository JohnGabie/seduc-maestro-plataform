import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30; // seconds

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [shakeError, setShakeError] = useState(false);

  const startLockoutTimer = useCallback(() => {
    setIsLocked(true);
    setLockoutTimer(LOCKOUT_DURATION);
    
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLocked(false);
          setAttempts(0);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    setError(null);
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Check credentials (demo: admin/admin)
    if (username === 'admin' && password === 'admin') {
      // Success - navigate to dashboard
      navigate('/bots');
    } else {
      // Failed attempt
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setError(`Conta bloqueada temporariamente. Aguarde ${LOCKOUT_DURATION} segundos.`);
        startLockoutTimer();
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setError(`Usuário ou senha incorretos. ${remaining} tentativa${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      {/* Login Card */}
      <div 
        className={`relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 space-y-8 ${
          shakeError ? 'animate-shake' : ''
        }`}
      >
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 mb-4">
            <svg 
              className="w-8 h-8 text-primary" 
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
          <h1 className="text-2xl font-semibold text-foreground">Maestro</h1>
          <p className="text-sm text-muted-foreground">Orquestrador de Bots — SEDUC DMGO</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className={`flex items-start gap-3 p-4 rounded-lg border ${
              isLocked 
                ? 'bg-warning/10 border-warning/20 text-warning' 
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}>
              {isLocked ? (
                <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium">{error}</p>
                {isLocked && (
                  <p className="text-xs opacity-80">
                    Tempo restante: {lockoutTimer}s
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Usuário
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={isLoading || isLocked}
              className="h-11 bg-secondary border-border focus:border-primary"
              autoComplete="username"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={isLoading || isLocked}
                className="h-11 bg-secondary border-border focus:border-primary pr-11"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isLocked}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading || isLocked}
              />
              <Label 
                htmlFor="remember" 
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Lembrar acesso
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
              disabled={isLoading || isLocked}
            >
              Esqueci a senha
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isLocked || !username || !password}
            className="w-full h-11 font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : isLocked ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Bloqueado ({lockoutTimer}s)
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Demo Hint */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-md">
              💡 Dica: <code className="font-mono text-primary">admin / admin</code> (somente ambiente de teste)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
