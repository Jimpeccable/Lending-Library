import React from 'react';
import { Heart, Calendar, Star, Trash2, Share2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const Favorites: React.FC = () => {
  const { items, favorites, toggleFavorite, reserveItem } = useLibrary();
  const { user } = useAuth();

  const favoriteItems = items.filter(item => favorites.includes(item.id));

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAvailabilityStatus = (status: string) => {
    switch (status) {
      case 'available':
        return { variant: 'success' as const, label: 'Available' };
      case 'loaned':
        return { variant: 'primary' as const, label: 'On Loan' };
      case 'reserved':
        return { variant: 'warning' as const, label: 'Reserved' };
      case 'maintenance':
        return { variant: 'danger' as const, label: 'Maintenance' };
      default:
        return { variant: 'neutral' as const, label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600">Items you've saved for future borrowing</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share List
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{favoriteItems.length}</div>
            <div className="text-sm text-gray-600">Favorite Items</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {favoriteItems.filter(item => item.status === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Available Now</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {favoriteItems.filter(item => item.status === 'loaned').length}
            </div>
            <div className="text-sm text-gray-600">Currently Borrowed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(favoriteItems.map(item => item.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </Card>
      </div>

      {/* Favorites Grid */}
      {favoriteItems.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No favorites yet</h3>
            <p className="text-gray-600 mt-2 mb-6">
              Start browsing items and add them to your favorites for easy access later.
            </p>
            <Button>Browse Items</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item) => {
            const availability = getAvailabilityStatus(item.status);
            
            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  <div className="absolute top-3 left-3">
                    <Badge variant={availability.variant}>
                      {availability.label}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                    <span className={`text-sm font-medium capitalize ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <div className="font-medium">{item.ageRecommendation}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Loan Period:</span>
                      <div className="font-medium">{item.lendingPeriod} days</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    {item.status === 'available' ? (
                      <Button className="flex-1" onClick={() => user && reserveItem(item.id, user.id)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Reserve
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled>
                        Not Available
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => toggleFavorite(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recommendations */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.slice(4, 7).map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={item.imageUrls[0]}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-xs text-gray-600">{item.category}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toggleFavorite(item.id)}>
                <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Favorites;