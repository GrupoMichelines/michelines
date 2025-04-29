export interface Evaluation {
  id: string;
  driverId: string;
  driverName: string;
  rating: number;
  comment: string;
  passengerName: string;
  passengerEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface Driver {
  id: string;
  name: string;
  photo?: string;
  averageRating: number;
  totalEvaluations: number;
  status: 'active' | 'inactive';
  createdAt: Date;
} 