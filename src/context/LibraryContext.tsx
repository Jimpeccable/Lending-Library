import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Member, Loan, Reservation, Library, MembershipTier } from '../types';
import { mockItems, mockMembers, mockLoans, mockReservations, mockLibraries, mockMembershipTiers } from '../data/mockData';
import { useToast } from './ToastContext';

interface LibraryContextType {
  items: Item[];
  members: Member[];
  loans: Loan[];
  reservations: Reservation[];
  libraries: Library[];
  membershipTiers: MembershipTier[];

  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  checkoutItem: (itemId: string, memberId: string, dueDate: string) => void;
  returnItem: (loanId: string, condition: Item['condition'], notes?: string) => void;
  reserveItem: (itemId: string, userId: string) => void;
  cancelReservation: (reservationId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [libraries] = useState<Library[]>(mockLibraries);
  const [membershipTiers] = useState<MembershipTier[]>(mockMembershipTiers);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage or mockData
  useEffect(() => {
    const storedItems = localStorage.getItem('library_items');
    const storedMembers = localStorage.getItem('library_members');
    const storedLoans = localStorage.getItem('library_loans');
    const storedReservations = localStorage.getItem('library_reservations');

    if (storedItems) setItems(JSON.parse(storedItems));
    else setItems(mockItems);

    if (storedMembers) setMembers(JSON.parse(storedMembers));
    else setMembers(mockMembers);

    if (storedLoans) setLoans(JSON.parse(storedLoans));
    else setLoans(mockLoans);

    if (storedReservations) setReservations(JSON.parse(storedReservations));
    else setReservations(mockReservations);

    setIsLoaded(true);
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('library_items', JSON.stringify(items));
      localStorage.setItem('library_members', JSON.stringify(members));
      localStorage.setItem('library_loans', JSON.stringify(loans));
      localStorage.setItem('library_reservations', JSON.stringify(reservations));
    }
  }, [items, members, loans, reservations, isLoaded]);

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Item = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems(prev => [...prev, newItem]);
    showToast(`${newItem.name} added to inventory`, 'success');
  };

  const updateItem = (id: string, itemUpdate: Partial<Item>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...itemUpdate, updatedAt: new Date().toISOString() } : item
    ));
    showToast(`Item updated successfully`, 'success');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    showToast(`Item deleted from inventory`, 'warning');
  };

  const checkoutItem = (itemId: string, borrowerId: string, dueDate: string) => {
    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      itemId,
      borrowerId,
      libraryId: 'lib1', // Assuming single library for now
      checkoutDate: new Date().toISOString(),
      dueDate,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLoans(prev => [...prev, newLoan]);
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: 'loaned', updatedAt: new Date().toISOString() } : item
    ));
    setMembers(prev => prev.map(member =>
      member.userId === borrowerId ? { ...member, activeLoans: member.activeLoans + 1, totalLoans: member.totalLoans + 1 } : member
    ));
    showToast(`Item checked out successfully`, 'success');
  };

  const returnItem = (loanId: string, condition: Item['condition'], notes?: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    setLoans(prev => prev.map(l =>
      l.id === loanId ? {
        ...l,
        status: 'returned',
        returnDate: new Date().toISOString(),
        notes,
        updatedAt: new Date().toISOString()
      } : l
    ));

    setItems(prev => prev.map(item =>
      item.id === loan.itemId ? {
        ...item,
        status: 'available',
        condition,
        updatedAt: new Date().toISOString()
      } : item
    ));

    setMembers(prev => prev.map(member =>
      member.userId === loan.borrowerId ? { ...member, activeLoans: Math.max(0, member.activeLoans - 1) } : member
    ));
    showToast(`Item returned successfully`, 'success');
  };

  const reserveItem = (itemId: string, userId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      itemId,
      itemName: item.name,
      borrowerId: userId,
      libraryId: item.libraryId,
      libraryName: 'Sunshine Community Toy Library', // Mock name
      reservationDate: new Date().toISOString(),
      reservedDate: new Date().toISOString(),
      status: 'active',
    };

    setReservations(prev => [...prev, newReservation]);
    setItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, status: 'reserved', updatedAt: new Date().toISOString() } : i
    ));
    showToast(`Item reserved successfully`, 'success');
  };

  const cancelReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    setReservations(prev => prev.map(r =>
      r.id === reservationId ? { ...r, status: 'cancelled' } : r
    ));

    setItems(prev => prev.map(i =>
      i.id === reservation.itemId ? { ...i, status: 'available', updatedAt: new Date().toISOString() } : i
    ));
    showToast(`Reservation cancelled`, 'info');
  };

  return (
    <LibraryContext.Provider value={{
      items, members, loans, reservations, libraries, membershipTiers,
      addItem, updateItem, deleteItem, checkoutItem, returnItem, reserveItem, cancelReservation
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};