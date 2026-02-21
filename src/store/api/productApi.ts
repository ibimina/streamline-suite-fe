import { baseApi } from './baseApi'
import { Product } from '@/types/product.type'
import { ProductFormData } from '@/schemas/product.schema'
import { PORTAL_BASE_PATH } from '@/contants'

// Query params for products list
interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Response types
interface ProductResponse {
  payload: {
    product: Product
  }
}

interface ProductsResponse {
  payload: {
    products: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface ProductStatsResponse {
  payload: {
    total: number
    active: number
    inactive: number
    lowStock: number
    outOfStock: number
  }
}

// Product API endpoints using RTK Query
export const productApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all products with pagination
    getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params && typeof params === 'object') {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value))
            }
          })
        }
        const queryString = queryParams.toString()
        return `${PORTAL_BASE_PATH}/products${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.products.map(({ _id }) => ({
                type: 'Product' as const,
                id: _id,
              })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Get single product by ID
    getProductById: builder.query<ProductResponse, string>({
      query: productId => `${PORTAL_BASE_PATH}/products/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    // Get product statistics
    getProductStats: builder.query<ProductStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/products/stats`,
      providesTags: [{ type: 'Product', id: 'STATS' }],
    }),

    // Get low stock products
    getLowStockProducts: builder.query<{ payload: { products: Product[] } }, void>({
      query: () => `${PORTAL_BASE_PATH}/products/low-stock`,
      providesTags: [{ type: 'Product', id: 'LOW_STOCK' }],
    }),

    // Create new product
    createProduct: builder.mutation<ProductResponse, ProductFormData>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/products`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'STATS' },
      ],
    }),

    // Update product
    updateProduct: builder.mutation<
      ProductResponse,
      { productId: string; data: Partial<ProductFormData> }
    >({
      query: ({ productId, data }) => ({
        url: `${PORTAL_BASE_PATH}/products/${productId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'STATS' },
        { type: 'Product', id: 'LOW_STOCK' },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: productId => ({
        url: `${PORTAL_BASE_PATH}/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'STATS' },
        { type: 'Product', id: 'LOW_STOCK' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useGetProductStatsQuery,
  useGetLowStockProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi
