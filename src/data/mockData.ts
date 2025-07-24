import { Library, Item, Member, MembershipTier, Loan, Reservation } from '../types';

export const mockLibraries: Library[] = [
  {
    id: 'lib1',
    name: 'Sunshine Community Toy Library',
    description: 'A vibrant community toy library serving families in the Sunshine district.',
    address: '123 Rainbow Street, Sunshine, CA 90210',
    contactEmail: 'hello@sunshinetoys.com',
    contactPhone: '+1 (555) 123-4567',
    logoUrl: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    ownerId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockMembershipTiers: MembershipTier[] = [
  {
    id: 'tier1',
    libraryId: 'lib1',
    name: 'Basic',
    description: 'Perfect for occasional borrowing',
    price: 15,
    billingInterval: 'monthly',
    borrowingLimit: 3,
    maxLoanDuration: 14,
    benefits: ['3 items at a time', '14-day loan period', 'Email notifications']
  },
  {
    id: 'tier2',
    libraryId: 'lib1',
    name: 'Premium',
    description: 'Great for active families',
    price: 25,
    billingInterval: 'monthly',
    borrowingLimit: 5,
    maxLoanDuration: 21,
    benefits: ['5 items at a time', '21-day loan period', 'SMS & email notifications', 'Priority reservations']
  },
  {
    id: 'tier3',
    libraryId: 'lib1',
    name: 'Family Plus',
    description: 'Best value for large families',
    price: 35,
    billingInterval: 'monthly',
    borrowingLimit: 8,
    maxLoanDuration: 28,
    benefits: ['8 items at a time', '28-day loan period', 'All notifications', 'Priority reservations', 'New arrival previews']
  }
];

export const mockItems: Item[] = [
  {
    id: 'item1',
    libraryId: 'lib1',
    name: 'LEGO Creator 3-in-1 Deep Sea Creatures',
    description: 'Build a shark, squid, or angler fish with this versatile LEGO set. Perfect for creative building and imaginative play.',
    category: 'Building Toys',
    ageRecommendation: '7-12 years',
    condition: 'excellent',
    replacementValue: 89.99,
    lendingPeriod: 14,
    barcode: 'TOY001234567',
    status: 'available',
    imageUrls: ['https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=400'],
    quantity: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item2',
    libraryId: 'lib1',
    name: 'Melissa & Doug Wooden Activity Table',
    description: 'Multi-activity table with bead maze, shape sorter, and spinning gears. Great for developing fine motor skills.',
    category: 'Educational',
    ageRecommendation: '12 months - 3 years',
    condition: 'good',
    replacementValue: 129.99,
    lendingPeriod: 21,
    barcode: 'TOY001234568',
    status: 'loaned',
    imageUrls: ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'],
    quantity: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item3',
    libraryId: 'lib1',
    name: 'Radio Flyer Classic Red Wagon',
    description: 'The timeless red wagon for adventures, hauling toys, and outdoor fun. Sturdy steel construction.',
    category: 'Outdoor',
    ageRecommendation: '18 months+',
    condition: 'good',
    replacementValue: 159.99,
    lendingPeriod: 14,
    barcode: 'TOY001234569',
    status: 'available',
    imageUrls: ['https://images.pexels.com/photos/1620653/pexels-photo-1620653.jpeg?auto=compress&cs=tinysrgb&w=400'],
    quantity: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item4',
    libraryId: 'lib1',
    name: 'Fisher-Price Laugh & Learn Smart Stages Chair',
    description: 'Interactive learning chair with songs, phrases, and activities that grow with your child.',
    category: 'Educational',
    ageRecommendation: '12-36 months',
    condition: 'excellent',
    replacementValue: 49.99,
    lendingPeriod: 14,
    barcode: 'TOY001234570',
    status: 'reserved',
    imageUrls: ['https://images.pexels.com/photos/8613317/pexels-photo-8613317.jpeg?auto=compress&cs=tinysrgb&w=400'],
    quantity: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item5',
    libraryId: 'lib1',
    name: 'Wooden Rainbow Stacking Rings',
    description: 'Beautiful handcrafted wooden stacking toy that helps develop hand-eye coordination and color recognition.',
    category: 'Educational',
    ageRecommendation: '6 months - 2 years',
    condition: 'excellent',
    replacementValue: 34.99,
    lendingPeriod: 14,
    barcode: 'TOY001234571',
    status: 'available',
    imageUrls: ['https://images.pexels.com/photos/1598377/pexels-photo-1598377.jpeg?auto=compress&cs=tinysrgb&w=400'],
    quantity: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item6',
    libraryId: 'lib1',
    name: 'Remote Control Dinosaur',
    description: 'Interactive RC dinosaur with lights, sounds, and walking action. Great for dinosaur enthusiasts!',
    category: 'Electronic',
    ageRecommendation: '5-10 years',
    condition: 'good',
    replacementValue: 79.99,
    lendingPeriod: 14,
    barcode: 'TOY001234572',
    status: 'available',
    imageUrls: ['https://images.pexels.com/photos/9016957/pexels-photo-9016957.jpeg?auto=compress&cs=tinysrgb&w=400'],
    quantity: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockMembers: Member[] = [
  {
    id: 'member1',
    userId: '2',
    libraryId: 'lib1',
    membershipTierId: 'tier2',
    status: 'active',
    joinDate: '2024-01-15T00:00:00Z',
    totalLoans: 12,
    activeLoans: 2,
    outstandingFees: 0
  },
  {
    id: 'member2',
    userId: '4',
    libraryId: 'lib1',
    membershipTierId: 'tier1',
    status: 'active',
    joinDate: '2024-02-01T00:00:00Z',
    totalLoans: 8,
    activeLoans: 1,
    outstandingFees: 5.50
  }
];

export const mockLoans: Loan[] = [
  {
    id: 'loan1',
    itemId: 'item2',
    borrowerId: '2',
    libraryId: 'lib1',
    checkoutDate: '2024-12-15T10:00:00Z',
    dueDate: '2025-01-05T23:59:59Z',
    status: 'active',
    notes: 'Member requested extended loan period',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z'
  },
  {
    id: 'loan2',
    itemId: 'item1',
    borrowerId: '4',
    libraryId: 'lib1',
    checkoutDate: '2024-12-10T14:30:00Z',
    dueDate: '2024-12-24T23:59:59Z',
    status: 'active',
    createdAt: '2024-12-10T14:30:00Z',
    updatedAt: '2024-12-10T14:30:00Z'
  }
];

export const mockReservations: Reservation[] = [
  {
    id: 'res1',
    itemId: 'item4',
    itemName: 'Fisher-Price Laugh & Learn Smart Stages Chair',
    borrowerId: '2',
    libraryId: 'lib1',
    libraryName: 'Sunshine Community Toy Library',
    reservationDate: '2024-12-20T09:00:00Z',
    reservedDate: '2024-12-20T09:00:00Z',
    status: 'active',
    pickupDeadline: '2024-12-27T23:59:59Z',
    queuePosition: 1,
    estimatedAvailability: 'Next week'
  }
];