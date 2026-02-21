import React, { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash2, Eye, QrCode, Grid, List, Download, Upload } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { Item } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';

const InventoryManagement: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLibrary();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: '',
    ageRecommendation: '',
    condition: 'excellent' as const,
    replacementValue: '',
    lendingPeriod: '14',
    barcode: '',
    quantity: '1',
    imageUrl: ''
  });

  const categories = [...new Set(items.map(item => item.category))];
  const statuses = [...new Set(items.map(item => item.status))];
  const conditions = ['excellent', 'good', 'fair', 'poor'];

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesCondition = !conditionFilter || item.condition === conditionFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Item] as string | number;
      let bValue: string | number = b[sortBy as keyof Item] as string | number;
      
      if (sortBy === 'replacementValue') {
        aValue = parseFloat(aValue.toString());
        bValue = parseFloat(bValue.toString());
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'loaned':
        return 'primary';
      case 'reserved':
        return 'warning';
      case 'maintenance':
        return 'danger';
      default:
        return 'neutral';
    }
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

  const handleAddItem = () => {
    addItem({
      libraryId: user?.libraryId || 'lib1',
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      ageRecommendation: newItem.ageRecommendation,
      condition: newItem.condition,
      replacementValue: parseFloat(newItem.replacementValue),
      lendingPeriod: parseInt(newItem.lendingPeriod),
      barcode: newItem.barcode,
      status: 'available',
      imageUrls: newItem.imageUrl ? [newItem.imageUrl] : ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'],
      quantity: parseInt(newItem.quantity),
    });

    setIsAddModalOpen(false);
    resetNewItem();
  };

  const handleEditItem = () => {
    if (!selectedItem) return;

    updateItem(selectedItem.id, {
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      ageRecommendation: newItem.ageRecommendation,
      condition: newItem.condition,
      replacementValue: parseFloat(newItem.replacementValue),
      lendingPeriod: parseInt(newItem.lendingPeriod),
      barcode: newItem.barcode,
      quantity: parseInt(newItem.quantity),
    });

    setIsEditModalOpen(false);
    setSelectedItem(null);
    resetNewItem();
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    
    deleteItem(selectedItem.id);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const resetNewItem = () => {
    setNewItem({
      name: '',
      description: '',
      category: '',
      ageRecommendation: '',
      condition: 'excellent',
      replacementValue: '',
      lendingPeriod: '14',
      barcode: '',
      quantity: '1',
      imageUrl: ''
    });
  };

  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      category: item.category,
      ageRecommendation: item.ageRecommendation,
      condition: item.condition,
      replacementValue: item.replacementValue.toString(),
      lendingPeriod: item.lendingPeriod.toString(),
      barcode: item.barcode,
      quantity: item.quantity.toString(),
      imageUrl: item.imageUrls[0] || ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedItems.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img
              src={item.imageUrls[0]}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{item.name}</h3>
              <div className="relative ml-2">
                <select 
                  className="text-xs border-none bg-transparent cursor-pointer"
                  onChange={(e) => {
                    const action = e.target.value;
                    if (action === 'edit') openEditModal(item);
                    if (action === 'delete') openDeleteModal(item);
                    e.target.value = '';
                  }}
                >
                  <option value="">⋯</option>
                  <option value="edit">Edit</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center justify-between">
              <Badge variant={getStatusVariant(item.status)} size="sm">
                {item.status}
              </Badge>
              <span className={`text-xs font-medium capitalize ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Category:</span>
                <div className="font-medium truncate">{item.category}</div>
              </div>
              <div>
                <span className="text-gray-600">Age:</span>
                <div className="font-medium truncate">{item.ageRecommendation}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
              <div>
                <span className="text-gray-600">Value: </span>
                <span className="font-semibold">${item.replacementValue}</span>
              </div>
              <div>
                <span className="text-gray-600">Qty: </span>
                <span className="font-semibold">{item.quantity}</span>
              </div>
            </div>
            
            <div className="flex space-x-1 pt-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => openEditModal(item)}>
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortBy === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}>
                Item {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortBy === 'category') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('category');
                      setSortOrder('asc');
                    }
                  }}>
                Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortBy === 'replacementValue') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('replacementValue');
                      setSortOrder('desc');
                    }
                  }}>
                Value {sortBy === 'replacementValue' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={item.imageUrls[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.barcode}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(item.status)} size="sm">
                    {item.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium capitalize ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.replacementValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.ageRecommendation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeleteModal(item)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your toy library's collection</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items..."
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
              placeholder="All statuses"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statuses.map(status => ({ 
                value: status, 
                label: status.charAt(0).toUpperCase() + status.slice(1) 
              }))}
            />
            <Select
              placeholder="All conditions"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              options={conditions.map(condition => ({ 
                value: condition, 
                label: condition.charAt(0).toUpperCase() + condition.slice(1) 
              }))}
            />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedItems.length} of {items.length} items
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{items.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {items.filter(item => item.status === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {items.filter(item => item.status === 'loaned').length}
            </div>
            <div className="text-sm text-gray-600">On Loan</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${items.reduce((sum, item) => sum + item.replacementValue, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </Card>
      </div>

      {/* Items Display */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetNewItem();
        }}
        title="Add New Item"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Item Name" 
              placeholder="Enter item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
            <Input 
              label="Category" 
              placeholder="e.g., Building Toys"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              required
            />
          </div>
          
          <Input 
            label="Description" 
            placeholder="Describe the item..."
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Age Recommendation" 
              placeholder="e.g., 3-8 years"
              value={newItem.ageRecommendation}
              onChange={(e) => setNewItem({ ...newItem, ageRecommendation: e.target.value })}
              required
            />
            <Select
              label="Condition"
              value={newItem.condition}
              onChange={(e) => setNewItem({ ...newItem, condition: e.target.value as Item['condition'] })}
              options={conditions.map(condition => ({ 
                value: condition, 
                label: condition.charAt(0).toUpperCase() + condition.slice(1) 
              }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Replacement Value ($)" 
              type="number" 
              placeholder="0.00"
              value={newItem.replacementValue}
              onChange={(e) => setNewItem({ ...newItem, replacementValue: e.target.value })}
              required
            />
            <Input 
              label="Lending Period (days)" 
              type="number" 
              placeholder="14"
              value={newItem.lendingPeriod}
              onChange={(e) => setNewItem({ ...newItem, lendingPeriod: e.target.value })}
              required
            />
            <Input 
              label="Quantity" 
              type="number" 
              placeholder="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Barcode/ID" 
              placeholder="Enter or scan barcode"
              value={newItem.barcode}
              onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
              required
            />
            <Input 
              label="Image URL (optional)" 
              placeholder="https://example.com/image.jpg"
              value={newItem.imageUrl}
              onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              resetNewItem();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={!newItem.name || !newItem.category || !newItem.description}>
              Add Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
          resetNewItem();
        }}
        title="Edit Item"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Item Name" 
              placeholder="Enter item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
            <Input 
              label="Category" 
              placeholder="e.g., Building Toys"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              required
            />
          </div>
          
          <Input 
            label="Description" 
            placeholder="Describe the item..."
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Age Recommendation" 
              placeholder="e.g., 3-8 years"
              value={newItem.ageRecommendation}
              onChange={(e) => setNewItem({ ...newItem, ageRecommendation: e.target.value })}
              required
            />
            <Select
              label="Condition"
              value={newItem.condition}
              onChange={(e) => setNewItem({ ...newItem, condition: e.target.value as Item['condition'] })}
              options={conditions.map(condition => ({ 
                value: condition, 
                label: condition.charAt(0).toUpperCase() + condition.slice(1) 
              }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Replacement Value ($)" 
              type="number" 
              placeholder="0.00"
              value={newItem.replacementValue}
              onChange={(e) => setNewItem({ ...newItem, replacementValue: e.target.value })}
              required
            />
            <Input 
              label="Lending Period (days)" 
              type="number" 
              placeholder="14"
              value={newItem.lendingPeriod}
              onChange={(e) => setNewItem({ ...newItem, lendingPeriod: e.target.value })}
              required
            />
            <Input 
              label="Quantity" 
              type="number" 
              placeholder="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Barcode/ID" 
              placeholder="Enter or scan barcode"
              value={newItem.barcode}
              onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
              required
            />
            <Input 
              label="Image URL (optional)" 
              placeholder="https://example.com/image.jpg"
              value={newItem.imageUrl}
              onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setSelectedItem(null);
              resetNewItem();
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditItem} disabled={!newItem.name || !newItem.category || !newItem.description}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        title="Delete Item"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedItem(null);
            }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              Delete Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InventoryManagement;