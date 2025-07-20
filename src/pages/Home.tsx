import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-history.jpg';

const Home = () => {
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateDate = (dateStr: string) => {
    const regex = /^(\d{1,2})\/(\d{1,2})$/;
    const match = dateStr.match(regex);
    
    if (!match) return false;
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    
    return day >= 1 && day <= 31 && month >= 1 && month <= 12;
  };

  const handleSearch = async () => {
    if (!date.trim()) {
      toast({
        title: "Ops! 📅",
        description: "Digite uma data no formato DD/MM",
        variant: "destructive"
      });
      return;
    }

    if (!validateDate(date)) {
      toast({
        title: "Data inválida! ❌",
        description: "Use o formato DD/MM (exemplo: 25/12)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const [day, month] = date.split('/');
      navigate(`/results/${month}/${day}`);
    } catch (error) {
      toast({
        title: "Erro na busca! 😔",
        description: "Tente novamente em alguns segundos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">📚 História</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/favorites')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Descubra a História</h2>
              <p className="text-sm opacity-90">Fatos marcantes de qualquer dia do ano</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-md mx-auto px-4 py-8">
        <Card className="p-6 bg-card border-border shadow-lg">
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Que dia você quer explorar?
              </h3>
              <p className="text-sm text-muted-foreground">
                Digite o dia e mês para descobrir eventos históricos
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Data (DD/MM)
                </label>
                <Input
                  type="text"
                  placeholder="Ex: 25/12"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-center text-lg bg-background border-border focus:border-primary"
                  maxLength={5}
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Descobrir História
                  </div>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Examples */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Exemplos:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {['25/12', '01/01', '15/04', '07/09'].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setDate(example)}
                className="text-xs border-border hover:border-primary"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;