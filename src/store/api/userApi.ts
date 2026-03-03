import { baseApi } from './baseApi'
import { UserFormData, UserQueryParams, UsersResponse, UserResponse } from '@/types/user.type'
import { PORTAL_BASE_PATH } from '@/contants'

// User API endpoints using RTK Query
export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all users with pagination
    getUsers: builder.query<UsersResponse, UserQueryParams | void>({
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
        return `${PORTAL_BASE_PATH}/users${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result?.payload?.data
          ? [
              ...result.payload.data.map(({ _id }) => ({
                type: 'User' as const,
                id: _id,
              })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get single user by ID
    getUserById: builder.query<UserResponse, string>({
      query: userId => `${PORTAL_BASE_PATH}/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // Create new user
    createUser: builder.mutation<UserResponse, UserFormData>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/users`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Update user
    updateUser: builder.mutation<UserResponse, { userId: string; data: Partial<UserFormData> }>({
      query: ({ userId, data }) => ({
        url: `${PORTAL_BASE_PATH}/users/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<{ message: string; status: number }, string>({
      query: userId => ({
        url: `${PORTAL_BASE_PATH}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Activate user
    activateUser: builder.mutation<UserResponse, string>({
      query: userId => ({
        url: `${PORTAL_BASE_PATH}/users/${userId}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Deactivate user
    deactivateUser: builder.mutation<UserResponse, string>({
      query: userId => ({
        url: `${PORTAL_BASE_PATH}/users/${userId}/deactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Reset user password
    resetUserPassword: builder.mutation<
      { message: string; status: number },
      { userId: string; newPassword: string }
    >({
      query: ({ userId, newPassword }) => ({
        url: `${PORTAL_BASE_PATH}/users/${userId}/reset-password`,
        method: 'PATCH',
        body: { newPassword },
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useResetUserPasswordMutation,
} = userApi
