import React, { useState } from 'react';
import { Calendar, Clock, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import type { Reservation } from '../../types';
import { useToast } from '../../context/ToastContext';

export function Reservations() {
  const { reservations, cancelReservation } = useLibrary();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelReservation = (reservationId: string) => {
    try {
      cancelReservation(reservationId);
      addToast('Reservation cancelled', 'success');
      setShowCancelModal(false);
      setSelectedReservation(null);
    } catch (error) {
      addToast('Failed to cancel reservation', 'danger');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'ready': return 'success';
      case 'expired': return 'danger';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const userReservations = reservations.filter(r => r.borrowerId === user?.id);
  const activeReservations = userReservations.filter(r => r.status === 'active');
  const readyReservations = userReservations.filter(r => r.status === 'ready');
  const expiredReservations = userReservations.filter(r => r.status === 'expired');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
          <p className="text-gray-600">Track your reserved items and pickup status</p>
        </div>
        <div className="text-sm text-gray-500">
          {reservations.length} total reservations
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeReservations.length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{readyReservations.length}</div>
            <div className="text-sm text-gray-600">Ready for Pickup</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{expiredReservations.length}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{reservations.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </Card>
      </div>

      {/* Ready for Pickup */}
      {readyReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Ready for Pickup ({readyReservations.length})
          </h2>
          <div className="grid gap-4">
            {readyReservations.map((reservation) => (
              <Card key={reservation.id} className="p-6 border-l-4 border-l-green-500 bg-green-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{reservation.itemName}</h3>
                      <Badge variant={getStatusColor(reservation.status)}>
                        {getStatusIcon(reservation.status)}
                        Ready for Pickup
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Reserved on {new Date(reservation.reservedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-green-700 font-medium">
                          Pickup by {new Date(reservation.pickupDeadline!).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.libraryName}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowCancelModal(true);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Reservations */}
      {activeReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active Reservations ({activeReservations.length})
          </h2>
          <div className="grid gap-4">
            {activeReservations.map((reservation) => (
              <Card key={reservation.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{reservation.itemName}</h3>
                      <Badge variant={getStatusColor(reservation.status)}>
                        {getStatusIcon(reservation.status)}
                        Position #{reservation.queuePosition}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Reserved on {new Date(reservation.reservedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Estimated availability: {reservation.estimatedAvailability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.libraryName}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowCancelModal(true);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Expired Reservations */}
      {expiredReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Expired Reservations ({expiredReservations.length})
          </h2>
          <div className="grid gap-4">
            {expiredReservations.map((reservation) => (
              <Card key={reservation.id} className="p-6 border-l-4 border-l-red-500 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{reservation.itemName}</h3>
                      <Badge variant={getStatusColor(reservation.status)}>
                        {getStatusIcon(reservation.status)}
                        Expired
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Reserved on {new Date(reservation.reservedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-red-700 font-medium">
                          Expired on {new Date(reservation.pickupDeadline!).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.libraryName}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowCancelModal(true);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {reservations.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reservations</h3>
          <p className="text-gray-500 mb-4">
            You don't have any active reservations. Browse items to make your first reservation.
          </p>
          <Button>Browse Items</Button>
        </Card>
      )}

      {/* Cancel Reservation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedReservation(null);
        }}
        title="Cancel Reservation"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel your reservation for{' '}
            <span className="font-semibold">{selectedReservation?.itemName}</span>?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false);
                setSelectedReservation(null);
              }}
            >
              Keep Reservation
            </Button>
            <Button
              variant="danger"
              onClick={() => handleCancelReservation(selectedReservation!.id)}
            >
              Cancel Reservation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}