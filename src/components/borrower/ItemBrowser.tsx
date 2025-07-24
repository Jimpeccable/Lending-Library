import React, { useState } from 'react';
import { Search, Filter, Heart, Calendar, Star, MapPin } from 'lucide-react';
import { mockItems } from '../../data/mockData';
import { Item } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';

const ItemBrowser: React.FC = () => {
  const [items] = useState<Item[]>(mockItems.filter(item => item.status === 'available'));
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = [...new Set(mockItems.map(item => item.category))];
  const ageGroups = [...new Set(mockItems.map(item => item.ageRecommendation))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesAge = !ageFilter || item.ageRecommendation === ageFilter;
    
    return matchesSearch && matchesCategory && matchesAge;
  });

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Toys</h1>
          <p className="text-gray-600">Discover amazing toys available for borrowing</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>Sunshine Community Toy Library</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search toys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="All categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories.map(cat => ({ value: cat, label: cat }))}
          />
          <Select
            placeholder="All ages"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            options={ageGroups.map(age => ({ value: age, label: age }))}
          />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredItems.length}</div>
            <div className="text-sm text-gray-600">Available Items</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {favorites.size}
            </div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">Free</div>
            <div className="text-sm text-gray-600">Borrowing Cost</div>
          </div>
        </Card>
      </div>

      {/* Featured Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(categoryFilter === category ? '' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={item.imageUrls[0]}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => toggleFavorite(item.id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  favorites.has(item.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
              </button>
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
              
              {item.quantity > 1 && (
                <Badge variant="neutral">
                  {item.quantity} available
                </Badge>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reserve
                </Button>
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No items found</h3>
            <p className="text-gray-600 mt-2">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ItemBrowser;