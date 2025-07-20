import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Skull, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface HistoryEvent {
  year: string;
  text: string;
}

interface HistoryData {
  events?: HistoryEvent[];
  deaths?: HistoryEvent[];
  births?: HistoryEvent[];
}

const Results = () => {
  const { month, day } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<HistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!month || !day) return;

      setIsLoading(true);
      
      try {
        const response = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
        
        if (!response.ok) {
          throw new Error('Falha na busca dos dados');
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          title: "Erro na busca! 😔",
          description: "Não foi possível carregar os dados históricos. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [month, day, toast]);

  const formatDate = () => {
    if (!day || !month) return '';
    
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const monthName = months[parseInt(month) - 1];
    return `${day} de ${monthName}`;
  };

  const handleEventClick = (event: HistoryEvent, category: string) => {
    navigate('/event-details', {
      state: {
        event,
        category,
        date: formatDate()
      }
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'events': return <Users className="h-4 w-4" />;
      case 'deaths': return <Skull className="h-4 w-4" />;
      case 'births': return <Baby className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'events': return 'border-events bg-events/5 hover:bg-events/10';
      case 'deaths': return 'border-deaths bg-deaths/5 hover:bg-deaths/10';
      case 'births': return 'border-births bg-births/5 hover:bg-births/10';
      default: return 'border-border';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Carregando...</h1>
          </div>
        </header>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Buscando fatos históricos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{formatDate()}</h1>
            <p className="text-xs text-muted-foreground">Fatos históricos</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted">
            <TabsTrigger value="events" className="text-xs data-[state=active]:bg-events data-[state=active]:text-white">
              <Users className="h-3 w-3 mr-1" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="deaths" className="text-xs data-[state=active]:bg-deaths data-[state=active]:text-white">
              <Skull className="h-3 w-3 mr-1" />
              Mortes
            </TabsTrigger>
            <TabsTrigger value="births" className="text-xs data-[state=active]:bg-births data-[state=active]:text-white">
              <Baby className="h-3 w-3 mr-1" />
              Nascimentos
            </TabsTrigger>
          </TabsList>

          {/* Events */}
          <TabsContent value="events" className="space-y-3">
            {data?.events?.length ? (
              data.events.map((event, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all duration-200 ${getCategoryColor('events')}`}
                  onClick={() => handleEventClick(event, 'events')}
                >
                  <div className="flex items-start gap-3">
                    {getCategoryIcon('events')}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-events">{event.year}</span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{event.text}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum evento encontrado para esta data</p>
              </Card>
            )}
          </TabsContent>

          {/* Deaths */}
          <TabsContent value="deaths" className="space-y-3">
            {data?.deaths?.length ? (
              data.deaths.map((event, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all duration-200 ${getCategoryColor('deaths')}`}
                  onClick={() => handleEventClick(event, 'deaths')}
                >
                  <div className="flex items-start gap-3">
                    {getCategoryIcon('deaths')}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-deaths">{event.year}</span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{event.text}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <Skull className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhuma morte registrada para esta data</p>
              </Card>
            )}
          </TabsContent>

          {/* Births */}
          <TabsContent value="births" className="space-y-3">
            {data?.births?.length ? (
              data.births.map((event, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all duration-200 ${getCategoryColor('births')}`}
                  onClick={() => handleEventClick(event, 'births')}
                >
                  <div className="flex items-start gap-3">
                    {getCategoryIcon('births')}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-births">{event.year}</span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{event.text}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <Baby className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum nascimento registrado para esta data</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;