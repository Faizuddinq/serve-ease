// **User Authentication Interfaces**
export interface AuthRequest {
    name?: string;
    email: string;
    phone?: string;
    password: string;
    role?: string;
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
    _id?: string;
    tableNo: number;
    status?: string;
    seats: number;
    currentOrder?: string | null;
  }
  
  export interface TableResponse {
    success: boolean;
    message?: string;
    data: Table[];
  }
  
  // **Order Item Interface**
  export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
  }
  
  // **Order Interfaces**
  export interface Order {
    _id?: string;
    customerDetails: {
      name: string;
      phone: string;
      guests: number;
    };
    orderStatus: string;
    orderDate: string;
    bills: {
      total: number;
      tax: number;
      totalWithTax: number;
    };
    items: OrderItem[]; // Array of Item objects
    table?: string; // Reference to Table
    paymentMethod?: string;
    paymentData?: {
      stripe_payment_intent_id?: string;
      stripe_charge_id?: string;
    };
    createdAt?: string;
    updatedAt?: string;
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
  