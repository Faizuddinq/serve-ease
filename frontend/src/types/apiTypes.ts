// **User Authentication Interfaces**
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    password: string; // Ideally, passwords shouldn't be sent in responses, but keeping it as per given response
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

// **Table Interfaces**
export interface Table {
  _id: string;
  tableNo: number;
  status: string; // "Available" or "Booked"
  seats: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TableResponse {
  success: boolean;
  message?: string;
  data: Table[];
}

// **Order Item Interface**
export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

// **Order Interfaces**
export interface Order {
  _id: string;
  customerDetails: {
    name: string;
    phone: string;
    guests: number;
  };
  orderStatus: string; // "Pending", "Completed", "Cancelled", etc.
  orderDate: string; // Date ISO String
  bills: {
    total: number;
    tax: number;
    totalWithTax: number;
  };
  items: OrderItem[]; // Array of Order Items
  table: Table; // Embedded Table Object
  paymentMethod: string; // Payment method e.g., "Cash", "Card"
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order[];
}

// **Payment Interfaces**
export interface PaymentRequest {
  amount: number;
  currency: string;
  email: string;
}

export interface Payment {
  _id?: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  email: string;
  contact: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data: Payment[];
}
