import axiosInstance from "../libs/axios";
import type { ApiResponse } from "../types/api/api.interface";
import type { Product } from "../types/interfaces/product.interface";
import type { Order } from "../types/interfaces/order.interface";
import type { User } from "../types/interfaces/user.interface";
import type { DashboardStats } from "../types/interfaces/dashboard.interface";
import type { UpdateOrderStatusDto } from "../types/dtos/order/update-order-status.dto";

// Admin Product API
const adminProductApi = {
  getAllProducts: () =>
    axiosInstance.get<ApiResponse<Product[]>>("/admin/products")
      .then((res) => res.data),
  
  createProduct: (productData: FormData) =>
    axiosInstance.post<ApiResponse<Product>>("/admin/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data),
  
  updateProduct: (id: string, productData: FormData) =>
    axiosInstance.put<ApiResponse<Product>>(`/admin/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data),
  
  deleteProduct: (id: string) =>
    axiosInstance.delete<ApiResponse<void>>(`/admin/products/${id}`)
      .then((res) => res.data),
};

// Admin Order API
const adminOrderApi = {
  getAllOrders: () =>
    axiosInstance.get<ApiResponse<Order[]>>("/admin/orders")
      .then((res) => res.data),
  
  updateOrderStatus: (orderId: string, statusData: UpdateOrderStatusDto) =>
    axiosInstance.patch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, statusData)
      .then((res) => res.data),
};

// Admin Customer API
const adminCustomerApi = {
  getAllCustomers: () =>
    axiosInstance.get<ApiResponse<User[]>>("/admin/customers")
      .then((res) => res.data),
};

// Admin Dashboard API
const adminDashboardApi = {
  getDashboardStats: () =>
    axiosInstance.get<ApiResponse<DashboardStats>>("/admin/stats")
      .then((res) => res.data),
};

// Admin API
export const adminApi = {
  ...adminProductApi,
  ...adminOrderApi,
  ...adminCustomerApi,
  ...adminDashboardApi,
};