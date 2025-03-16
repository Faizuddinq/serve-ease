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

// ✅ Create Order Request
export interface CreateOrderRequest {
  amount: number;
}

// ✅ Create Order Response
export interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    created_at: number;
  };
}

// ✅ Verify Payment Request
export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ✅ Verify Payment Response
export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

// ✅ Webhook Request (Incoming data from Razorpay)
export interface WebhookPaymentCaptured {
  event: "payment.captured";
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
        email: string;
        contact: string;
        created_at: number;
      };
    };
  };
}

// ✅ Webhook Response
export interface WebhookResponse {
  success: boolean;
}
