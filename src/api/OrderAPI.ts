import { api } from "./index";

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  confirmedAt?: string;
  payment: string;
  userId: number;
}

interface CreateOrderDto {
  totalPrice: number;
  payment: string;
  userId: number;
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "orders",
    }),
    getUserOrders: builder.query<Order[], number>({
      query: (userId) => `orders/user/${userId}`,
    }),
    getOrderById: builder.query<Order, number>({
      query: (orderId) => `orders/${orderId}`,
    }),
    createOrder: builder.mutation<Order, CreateOrderDto>({
      query: (data) => ({
        url: "orders",
        method: "POST",
        body: data,
      }),
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { orderId: number; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
    }),
    deleteOrder: builder.mutation<{ success: boolean; id: number }, number>({
      query: (orderId) => ({
        url: `orders/${orderId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
