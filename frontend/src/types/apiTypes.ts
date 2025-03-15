// ==========================
// 🔹 USER AUTHENTICATION
// ==========================

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string; // ✅ Use union type for role
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    password?: string; // ❌ Removed from response for security best practices
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

// ==========================
// 🔹 TABLE INTERFACES
// ==========================

export interface TableRequest {
  tableNo: number;
  seats: number;
}

export interface Table {
  _id: string;
  tableNo: number;
  status: string; // ✅ Use stricter types
  seats: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  currentOrder?: Order; // ✅ Reference to current order (optional)
}

export interface TableResponse {
  success: boolean;
  message: string;
  data: Table[];
}

// ==========================
// 🔹 ORDER INTERFACES
// ==========================

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Bills {
  total: number;
  tax: number;
  totalWithTax: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  guests: number;
}

export interface Order {
  _id: string;
  customerDetails: CustomerDetails;
  bills: Bills;
  orderStatus: string; // ✅ Stricter status
  items: OrderItem[];
  table: Table;
  paymentMethod: string; // ✅ Stricter types
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order[];
}

// ==========================
// 🔹 PAYMENT INTERFACES
// ==========================

export interface PaymentRequest {
  amount: number;
  currency: string; // ✅ Limited currency options
  email: string;
}

export interface Payment {
  _id?: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string; // ✅ Stricter status types
  method: string; // ✅ Use specific payment methods
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
