export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'host' | 'borrower' | 'super-user';
  libraryId?: string;
  membershipTierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Library {
  id: string;
  name: string;
  description: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  libraryId: string;
  name: string;
  description: string;
  category: string;
  ageRecommendation: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  replacementValue: number;
  lendingPeriod: number;
  barcode: string;
  status: 'available' | 'loaned' | 'reserved' | 'maintenance';
  imageUrls: string[];
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  itemId: string;
  borrowerId: string;
  libraryId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue' | 'lost';
  lateFee?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  userId: string;
  libraryId: string;
  membershipTierId: string;
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  totalLoans: number;
  activeLoans: number;
  outstandingFees: number;
}

export interface MembershipTier {
  id: string;
  libraryId: string;
  name: string;
  description: string;
  price: number;
  billingInterval: 'monthly' | 'yearly';
  borrowingLimit: number;
  maxLoanDuration: number;
  benefits: string[];
}

export interface Reservation {
  id: string;
  itemId: string;
  itemName: string;
  borrowerId: string;
  libraryId: string;
  libraryName: string;
  reservationDate: string;
  reservedDate: string;
  status: 'active' | 'ready' | 'fulfilled' | 'cancelled';
  pickupDeadline?: string;
  queuePosition?: number;
  estimatedAvailability?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}