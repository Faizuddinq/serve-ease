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

// ✅ Define Request Type (Sent to API)
export interface TableRequest {
  tableNo: number;
  seats: number;
}

// ✅ Define Response Type (Received from API)
export interface Table {
  _id: string;
  tableNo: number;
  status: string;
  seats: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ✅ Define API Response Type
export interface TableResponse {
  success: boolean;
  message: string;
  data: Table;
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
  bills: {
    total: number;
    tax: number;
    totalWithTax: number;
  };
  orderStatus: string;
  items: OrderItem[];
  table: {
    _id: string;
    tableNo: number;
    status: string;
    seats: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  paymentMethod: string;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Define API Response Type
export interface OrderResponse {
  success: boolean;
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
