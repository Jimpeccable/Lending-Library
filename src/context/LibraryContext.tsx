import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Member, Loan, Reservation, Library, MembershipTier, Message, LibrarySettings } from '../types';
import { mockItems, mockMembers, mockLoans, mockReservations, mockLibraries, mockMembershipTiers } from '../data/mockData';
import { useToast } from './ToastContext';

interface LibraryContextType {
  items: Item[];
  members: Member[];
  loans: Loan[];
  reservations: Reservation[];
  libraries: Library[];
  membershipTiers: MembershipTier[];
  messages: Message[];
  librarySettings: LibrarySettings;
  favorites: string[];

  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  checkoutItem: (itemId: string, borrowerId: string, dueDate: string) => void;
  returnItem: (loanId: string, condition: Item['condition'], notes?: string) => void;
  reserveItem: (itemId: string, userId: string) => void;
  cancelReservation: (reservationId: string) => void;
  toggleFavorite: (itemId: string) => void;
  sendMessage: (recipientId: string, content: string, senderId: string, senderName: string, isFromMember: boolean) => void;
  updateSettings: (settings: Partial<LibrarySettings>) => void;
  approveLibrary: (libraryId: string) => void;
  suspendLibrary: (libraryId: string) => void;
  updateLibrary: (libraryId: string, updates: Partial<Library>) => void;
  addLibrary: (library: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addMembershipTier: (tier: Omit<MembershipTier, 'id'>) => void;
  updateMembershipTier: (id: string, tier: Partial<MembershipTier>) => void;
  deleteMembershipTier: (id: string) => void;
  addMember: (member: Omit<Member, 'id' | 'joinDate' | 'totalLoans' | 'activeLoans' | 'outstandingFees'>) => void;
  updateMemberStatus: (id: string, status: Member['status']) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [librarySettings, setLibrarySettings] = useState<LibrarySettings>({
    name: 'Sunshine Community Toy Library',
    description: 'A vibrant community toy library serving families in the Sunshine district.',
    address: '123 Rainbow Street, Sunshine, CA 90210',
    contactEmail: 'hello@sunshinetoys.com',
    contactPhone: '+1 (555) 123-4567',
    website: 'https://sunshinetoys.com',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    maxLoanDuration: 14,
    maxRenewals: 2,
    lateFeePerDay: 1.0,
    reservationHoldDays: 3,
    membershipRequired: true
  });
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage or mockData
  useEffect(() => {
    const storedItems = localStorage.getItem('library_items');
    const storedMembers = localStorage.getItem('library_members');
    const storedLoans = localStorage.getItem('library_loans');
    const storedReservations = localStorage.getItem('library_reservations');
    const storedFavorites = localStorage.getItem('library_favorites');
    const storedMessages = localStorage.getItem('library_messages');
    const storedSettings = localStorage.getItem('library_settings');
    const storedLibraries = localStorage.getItem('library_list');
    const storedTiers = localStorage.getItem('membership_tiers');

    if (storedItems) setItems(JSON.parse(storedItems));
    else setItems(mockItems);

    if (storedMembers) setMembers(JSON.parse(storedMembers));
    else setMembers(mockMembers);

    if (storedLoans) setLoans(JSON.parse(storedLoans));
    else setLoans(mockLoans);

    if (storedReservations) setReservations(JSON.parse(storedReservations));
    else setReservations(mockReservations);

    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

    if (storedTiers) setMembershipTiers(JSON.parse(storedTiers));
    else setMembershipTiers(mockMembershipTiers);

    if (storedMessages) setMessages(JSON.parse(storedMessages));
    else {
      // Default mock messages
      setMessages([
        {
          id: 'msg-1',
          senderId: '2',
          senderName: 'John Borrower',
          recipientId: '1',
          content: 'Hi! I wanted to ask about extending my loan for the LEGO set.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          read: true,
          isFromMember: true
        },
        {
          id: 'msg-2',
          senderId: '1',
          senderName: 'Library Host',
          recipientId: '2',
          content: 'Hello John! I can extend your loan for another week. Would that work for you?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.8).toISOString(),
          read: true,
          isFromMember: false
        },
        {
          id: 'msg-3',
          senderId: '2',
          senderName: 'John Borrower',
          recipientId: '1',
          content: 'Thank you for the reminder about the due date!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: false,
          isFromMember: true
        }
      ]);
    }

    if (storedSettings) setLibrarySettings(JSON.parse(storedSettings));

    if (storedLibraries) setLibraries(JSON.parse(storedLibraries));
    else setLibraries(mockLibraries);

    setIsLoaded(true);
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('library_items', JSON.stringify(items));
      localStorage.setItem('library_members', JSON.stringify(members));
      localStorage.setItem('library_loans', JSON.stringify(loans));
      localStorage.setItem('library_reservations', JSON.stringify(reservations));
      localStorage.setItem('library_favorites', JSON.stringify(favorites));
      localStorage.setItem('library_messages', JSON.stringify(messages));
      localStorage.setItem('library_settings', JSON.stringify(librarySettings));
      localStorage.setItem('library_list', JSON.stringify(libraries));
      localStorage.setItem('membership_tiers', JSON.stringify(membershipTiers));
    }
  }, [items, members, loans, reservations, favorites, messages, librarySettings, libraries, membershipTiers, isLoaded]);

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

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      if (prev.includes(itemId)) {
        showToast('Removed from favorites', 'info');
        return prev.filter(id => id !== itemId);
      } else {
        showToast('Added to favorites', 'success');
        return [...prev, itemId];
      }
    });
  };

  const sendMessage = (recipientId: string, content: string, senderId: string, senderName: string, isFromMember: boolean) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      isFromMember
    };
    setMessages(prev => [...prev, newMessage]);
    showToast('Message sent', 'success');
  };

  const updateSettings = (settings: Partial<LibrarySettings>) => {
    setLibrarySettings(prev => ({ ...prev, ...settings }));
    showToast('Settings updated', 'success');
  };

  const approveLibrary = (libraryId: string) => {
    setLibraries(prev => prev.map(lib =>
      lib.id === libraryId ? { ...lib, status: 'active', updatedAt: new Date().toISOString() } : lib
    ));
    showToast('Library approved', 'success');
  };

  const suspendLibrary = (libraryId: string) => {
    setLibraries(prev => prev.map(lib =>
      lib.id === libraryId ? { ...lib, status: 'suspended', updatedAt: new Date().toISOString() } : lib
    ));
    showToast('Library suspended', 'warning');
  };

  const updateLibrary = (libraryId: string, updates: Partial<Library>) => {
    setLibraries(prev => prev.map(lib =>
      lib.id === libraryId ? { ...lib, ...updates, updatedAt: new Date().toISOString() } : lib
    ));
    showToast('Library updated', 'success');
  };

  const addLibrary = (libraryData: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLibrary: Library = {
      ...libraryData,
      id: `lib-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLibraries(prev => [...prev, newLibrary]);
    showToast(`${newLibrary.name} added successfully`, 'success');
  };

  const addMembershipTier = (tierData: Omit<MembershipTier, 'id'>) => {
    const newTier: MembershipTier = {
      ...tierData,
      id: `tier-${Date.now()}`
    };
    setMembershipTiers(prev => [...prev, newTier]);
    showToast(`${newTier.name} tier added`, 'success');
  };

  const updateMembershipTier = (id: string, tierUpdate: Partial<MembershipTier>) => {
    setMembershipTiers(prev => prev.map(tier =>
      tier.id === id ? { ...tier, ...tierUpdate } : tier
    ));
    showToast('Membership tier updated', 'success');
  };

  const deleteMembershipTier = (id: string) => {
    setMembershipTiers(prev => prev.filter(tier => tier.id !== id));
    showToast('Membership tier deleted', 'warning');
  };

  const addMember = (memberData: Omit<Member, 'id' | 'joinDate' | 'totalLoans' | 'activeLoans' | 'outstandingFees'>) => {
    const newMember: Member = {
      ...memberData,
      id: `member-${Date.now()}`,
      joinDate: new Date().toISOString(),
      totalLoans: 0,
      activeLoans: 0,
      outstandingFees: 0
    };
    setMembers(prev => [...prev, newMember]);
    showToast('Member added successfully', 'success');
  };

  const updateMemberStatus = (id: string, status: Member['status']) => {
    setMembers(prev => prev.map(member =>
      member.id === id ? { ...member, status } : member
    ));
    showToast(`Member status updated to ${status}`, 'success');
  };

  return (
    <LibraryContext.Provider value={{
      items, members, loans, reservations, libraries, membershipTiers, favorites, messages, librarySettings,
      addItem, updateItem, deleteItem, checkoutItem, returnItem, reserveItem, cancelReservation, toggleFavorite,
      sendMessage, updateSettings, approveLibrary, suspendLibrary, updateLibrary, addLibrary,
      addMembershipTier, updateMembershipTier, deleteMembershipTier, addMember, updateMemberStatus
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