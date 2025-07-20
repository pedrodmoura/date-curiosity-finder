import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Share2, Calendar, Users, Skull, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface EventDetailsState {
  event: {
    year: string;
    text: string;
  };
  category: string;
  date: string;
}

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  
  const state = location.state as EventDetailsState;

  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }

    // Verificar se já está nos favoritos
    const favorites = JSON.parse(localStorage.getItem('historyFavorites') || '[]');
    const isAlreadyFavorited = favorites.some((fav: any) => 
      fav.event.year === state.event.year && 
      fav.event.text === state.event.text
    );
    setIsFavorited(isAlreadyFavorited);
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { event, category, date } = state;

  const getCategoryInfo = () => {
    switch (category) {
      case 'events':
        return {
          icon: <Users className="h-5 w-5" />,
          label: 'Evento Histórico',
          color: 'text-events',
          bgColor: 'bg-events/10 border-events'
        };
      case 'deaths':
        return {
          icon: <Skull className="h-5 w-5" />,
          label: 'Morte',
          color: 'text-deaths',
          bgColor: 'bg-deaths/10 border-deaths'
        };
      case 'births':
        return {
          icon: <Baby className="h-5 w-5" />,
          label: 'Nascimento',
          color: 'text-births',
          bgColor: 'bg-births/10 border-births'
        };
      default:
        return {
          icon: <Calendar className="h-5 w-5" />,
          label: 'Fato Histórico',
          color: 'text-primary',
          bgColor: 'bg-primary/10 border-primary'
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('historyFavorites') || '[]');
    
    if (isFavorited) {
      // Remover dos favoritos
      const updatedFavorites = favorites.filter((fav: any) => 
        !(fav.event.year === event.year && fav.event.text === event.text)
      );
      localStorage.setItem('historyFavorites', JSON.stringify(updatedFavorites));
      setIsFavorited(false);
      
      toast({
        title: "Removido dos favoritos! 💔",
        description: "Evento removido da sua lista de favoritos",
      });
    } else {
      // Adicionar aos favoritos
      const newFavorite = {
        event,
        category,
        date,
        addedAt: new Date().toISOString()
      };
      favorites.push(newFavorite);
      localStorage.setItem('historyFavorites', JSON.stringify(favorites));
      setIsFavorited(true);
      
      toast({
        title: "Adicionado aos favoritos! ⭐",
        description: "Evento salvo na sua lista de favoritos",
      });
    }
  };

  const handleShare = async () => {
    const shareText = `📚 Fato histórico de ${date}:\n\n${event.year} - ${event.text}\n\nDescuberto no app História!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fato histórico - ${date}`,
          text: shareText,
        });
      } catch (error) {
        // Usuário cancelou o compartilhamento
      }
    } else {
      // Fallback: copiar para clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copiado! 📋",
          description: "Texto copiado para a área de transferência",
        });
      } catch (error) {
        toast({
          title: "Erro ao compartilhar 😔",
          description: "Não foi possível compartilhar este evento",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg font-semibold">{date}</h1>
            <p className="text-xs text-muted-foreground">{categoryInfo.label}</p>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={isFavorited ? 'text-yellow-500' : 'text-muted-foreground'}
            >
              <Star className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-muted-foreground"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className={`p-6 ${categoryInfo.bgColor} border-2`}>
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-full bg-background/50 ${categoryInfo.color}`}>
              {categoryInfo.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{categoryInfo.label}</p>
              <p className="text-xs text-muted-foreground">{date}</p>
            </div>
          </div>

          {/* Year */}
          <div className="mb-4">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${categoryInfo.color} bg-background/50`}>
              {event.year}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed text-base">
              {event.text}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-background/20">
            <Button
              onClick={handleFavorite}
              variant={isFavorited ? "default" : "outline"}
              className="flex-1"
            >
              <Star className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="mt-4 p-4 bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Este evento aconteceu há {new Date().getFullYear() - parseInt(event.year)} anos</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;