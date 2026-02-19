import React from 'react';
import { Building, CheckCircle, XCircle, MoreVertical, Search, Filter } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useState } from 'react';
import { Library } from '../../types';

const LibraryManagement: React.FC = () => {
  const { libraries, approveLibrary, suspendLibrary, updateLibrary, addLibrary } = useLibrary();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [libData, setLibData] = useState({
    name: '',
    description: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    ownerId: ''
  });

  const filteredLibraries = libraries.filter(lib =>
    lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLibrary = () => {
    addLibrary({
      name: libData.name,
      description: libData.description,
      address: libData.address,
      contactEmail: libData.contactEmail,
      contactPhone: libData.contactPhone,
      status: 'pending',
      ownerId: libData.ownerId || '1' // Default to system user or first user
    });
    setIsAddModalOpen(false);
    resetLibData();
  };

  const handleEditLibrary = () => {
    if (!selectedLibrary) return;
    updateLibrary(selectedLibrary.id, {
      name: libData.name,
      description: libData.description,
      address: libData.address,
      contactEmail: libData.contactEmail,
      contactPhone: libData.contactPhone,
      ownerId: libData.ownerId
    });
    setIsEditModalOpen(false);
    setSelectedLibrary(null);
    resetLibData();
  };

  const resetLibData = () => {
    setLibData({
      name: '',
      description: '',
      address: '',
      contactEmail: '',
      contactPhone: '',
      ownerId: ''
    });
  };

  const openEditModal = (lib: Library) => {
    setSelectedLibrary(lib);
    setLibData({
      name: lib.name,
      description: lib.description,
      address: lib.address,
      contactEmail: lib.contactEmail,
      contactPhone: lib.contactPhone,
      ownerId: lib.ownerId
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600">Manage and moderate all toy libraries on the platform</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Building className="w-4 h-4 mr-2" />
          Add New Library
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search libraries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 border-b border-gray-200">Library</th>
                <th className="px-6 py-3 border-b border-gray-200">Contact</th>
                <th className="px-6 py-3 border-b border-gray-200">Status</th>
                <th className="px-6 py-3 border-b border-gray-200">Created At</th>
                <th className="px-6 py-3 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLibraries.map((library) => (
                <tr key={library.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        {library.logoUrl ? (
                          <img src={library.logoUrl} alt={library.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <Building className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{library.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{library.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{library.contactEmail}</div>
                    <div className="text-xs text-gray-500">{library.contactPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(library.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(library.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {library.status !== 'active' && (
                        <button
                          onClick={() => approveLibrary(library.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {library.status !== 'suspended' && (
                        <button
                          onClick={() => suspendLibrary(library.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Suspend"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(library)}
                        className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Library Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedLibrary(null);
          resetLibData();
        }}
        title={isEditModalOpen ? "Edit Library" : "Add New Library"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Library Name"
            placeholder="Sunshine Community Toy Library"
            value={libData.name}
            onChange={(e) => setLibData({ ...libData, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Briefly describe the library..."
            value={libData.description}
            onChange={(e) => setLibData({ ...libData, description: e.target.value })}
            required
          />
          <Input
            label="Address"
            placeholder="123 Main St, Anytown, ST 12345"
            value={libData.address}
            onChange={(e) => setLibData({ ...libData, address: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              placeholder="contact@library.com"
              value={libData.contactEmail}
              onChange={(e) => setLibData({ ...libData, contactEmail: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+1 (555) 000-0000"
              value={libData.contactPhone}
              onChange={(e) => setLibData({ ...libData, contactPhone: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              setSelectedLibrary(null);
              resetLibData();
            }}>
              Cancel
            </Button>
            <Button
              onClick={isEditModalOpen ? handleEditLibrary : handleAddLibrary}
              disabled={!libData.name || !libData.contactEmail}
            >
              {isEditModalOpen ? 'Save Changes' : 'Create Library'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LibraryManagement;
