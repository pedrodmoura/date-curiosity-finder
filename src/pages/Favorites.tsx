import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Calendar, Users, Skull, Baby, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FavoriteEvent {
  event: {
    year: string;
    text: string;
  };
  category: string;
  date: string;
  addedAt: string;
}

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('historyFavorites') || '[]');
    setFavorites(savedFavorites.reverse()); // Mais recentes primeiro
  }, []);

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'events':
        return {
          icon: <Users className="h-4 w-4" />,
          label: 'Evento',
          color: 'text-events',
          bgColor: 'border-events bg-events/5'
        };
      case 'deaths':
        return {
          icon: <Skull className="h-4 w-4" />,
          label: 'Morte',
          color: 'text-deaths',
          bgColor: 'border-deaths bg-deaths/5'
        };
      case 'births':
        return {
          icon: <Baby className="h-4 w-4" />,
          label: 'Nascimento',
          color: 'text-births',
          bgColor: 'border-births bg-births/5'
        };
      default:
        return {
          icon: <Calendar className="h-4 w-4" />,
          label: 'Fato',
          color: 'text-primary',
          bgColor: 'border-primary bg-primary/5'
        };
    }
  };

  const removeFavorite = (favoriteToRemove: FavoriteEvent) => {
    const updatedFavorites = favorites.filter(fav => 
      !(fav.event.year === favoriteToRemove.event.year && 
        fav.event.text === favoriteToRemove.event.text)
    );
    
    setFavorites(updatedFavorites);
    localStorage.setItem('historyFavorites', JSON.stringify(updatedFavorites.reverse()));
    
    toast({
      title: "Removido dos favoritos! 🗑️",
      description: "Evento removido da sua lista de favoritos",
    });
  };

  const openEventDetails = (favorite: FavoriteEvent) => {
    navigate('/event-details', {
      state: {
        event: favorite.event,
        category: favorite.category,
        date: favorite.date
      }
    });
  };

  const formatAddedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (favorites.length === 0) {
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
            <h1 className="text-lg font-semibold">Favoritos</h1>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-sm px-4">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Explore fatos históricos e favorite os que mais te interessarem!
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Descobrir História
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Favoritos</h1>
              <p className="text-xs text-muted-foreground">{favorites.length} eventos salvos</p>
            </div>
          </div>
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-3">
          {favorites.map((favorite, index) => {
            const categoryInfo = getCategoryInfo(favorite.category);
            
            return (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${categoryInfo.bgColor}`}
                onClick={() => openEventDetails(favorite)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full bg-background/50 ${categoryInfo.color}`}>
                      {categoryInfo.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${categoryInfo.color}`}>
                        {favorite.event.year}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {favorite.date}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground line-clamp-2 mb-2">
                      {favorite.event.text}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        <span>Salvo em {formatAddedDate(favorite.addedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(favorite);
                    }}
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <Card className="mt-6 p-4 bg-muted/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ⭐ {favorites.length} evento{favorites.length !== 1 ? 's' : ''} favorito{favorites.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Toque em qualquer evento para ver os detalhes
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Favorites;