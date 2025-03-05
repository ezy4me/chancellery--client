import { api } from "./index";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: any;
  quantity: number;
  categoryId: number;
  supplierId: number;
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "product",
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `product/${id}`,
    }),
    createProduct: builder.mutation<Product, Omit<Product, "id">>({
      query: (data) => ({
        url: `product`,
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation<Product, Partial<Product> & { id: number }>(
      {
        query: ({ id, ...data }) => ({
          url: `product/${id}`,
          method: "PUT",
          body: data,
        }),
      }
    ),
    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
