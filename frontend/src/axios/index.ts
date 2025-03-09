import { api } from "./api";
import {
  AuthRequest, AuthResponse, Table, TableResponse, PaymentRequest, PaymentResponse, Order, OrderResponse } from "../types/apiTypes";

// **Auth Endpoints**
export const login = (data: AuthRequest) => api.post<AuthResponse>("/user/login", data);
export const register = (data: AuthRequest) => api.post<AuthResponse>("/user/register", data);
export const getUserData = () => api.get<AuthResponse>("/user");
export const logout = () => api.post("/user/logout");

// **Table Endpoints**
export const addTable = (data: Table) => api.post<TableResponse>("/table", data);
export const getTables = () => api.get<TableResponse>("/table");
export const updateTable = (tableId: string, tableData: Partial<Table>) =>
  api.put<TableResponse>(`/table/${tableId}`, tableData);

// **Payment Endpoints**
export const createOrderRazorpay = (data: PaymentRequest) =>
  api.post<PaymentResponse>("/payment/create-order", data);
export const verifyPaymentRazorpay = (data: { paymentIntentId: string }) =>
  api.post<PaymentResponse>("/payment/verify-payment", data);

// **Order Endpoints**
export const addOrder = (data: Order) => api.post<OrderResponse>("/order", data);
export const getOrders = () => api.get<OrderResponse>("/order");
export const updateOrderStatus = (orderId: string, orderStatus: string) =>
  api.put<OrderResponse>(`/order/${orderId}`, { orderStatus });
