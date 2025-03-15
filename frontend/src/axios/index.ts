import { api } from "./api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, AuthResponse, Table, TableResponse, PaymentRequest, PaymentResponse, Order, OrderResponse, TableRequest } from "../types/apiTypes";



// **Auth Endpoints**
export const login = (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data); //ts recheck done


  
export const register = (data: RegisterRequest) => api.post<RegisterResponse>("/auth/register", data); //ts recheck done

export const getUserData = () => api.get<AuthResponse>("/auth"); //ts recheck done

export const logout = () => api.post("/auth/logout");

// **Table Endpoints**
export const addTable = (data: TableRequest) => api.post<TableResponse>("/table", data); //ts recheck done
export const getTables = () => api.get<TableResponse>("/table");
export const updateTable = (tableId: string, tableData: Partial<Table>) => api.put<TableResponse>(`/table/${tableId}`, tableData);

// **Payment Endpoints**
export const createOrderRazorpay = (data: PaymentRequest) => api.post<PaymentResponse>("/payment/create-order", data);
export const verifyPaymentRazorpay = (data: { paymentIntentId: string }) => api.post<PaymentResponse>("/payment/verify-payment", data);

// **Order Endpoints**
export const addOrder = (data: Order) => api.post<OrderResponse>("/order", data); 
export const getOrders = () => api.get<OrderResponse>("/order"); //ts recheck done
export const updateOrderStatus = (orderId: string, orderStatus: string) => api.put<OrderResponse>(`/order/${orderId}`, { orderStatus });
