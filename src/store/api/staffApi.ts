import { baseApi } from './baseApi'
import {
  Staff,
  StaffFormData,
  StaffQueryParams,
  StaffResponse,
  StaffsResponse,
  StaffStatsResponse,
  StaffStatus,
} from '@/types/staff.type'
import { PORTAL_BASE_PATH } from '@/contants'

// Staff API endpoints using RTK Query
export const staffApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all staff with pagination
    getStaff: builder.query<StaffsResponse, StaffQueryParams | void>({
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
        return `${PORTAL_BASE_PATH}/staff${queryString ? `?${queryString}` : ''}`
      },
      providesTags: result =>
        result
          ? [
              ...result.payload.data.map(({ _id }) => ({
                type: 'Staff' as const,
                id: _id,
              })),
              { type: 'Staff', id: 'LIST' },
            ]
          : [{ type: 'Staff', id: 'LIST' }],
    }),

    // Get single staff by ID
    getStaffById: builder.query<{ payload: Staff; message: string; status: number }, string>({
      query: staffId => `${PORTAL_BASE_PATH}/staff/${staffId}`,
      providesTags: (result, error, staffId) => [{ type: 'Staff', id: staffId }],
    }),

    // Get staff statistics
    getStaffStats: builder.query<StaffStatsResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/staff/stats`,
      providesTags: [{ type: 'Staff', id: 'STATS' }],
    }),

    // Get active staff (for dropdowns/selects)
    getActiveStaff: builder.query<
      { payload: { data: Staff[] }; message: string; status: number },
      void
    >({
      query: () => `${PORTAL_BASE_PATH}/staff/active`,
      providesTags: [{ type: 'Staff', id: 'ACTIVE' }],
    }),

    // Get staff by department
    getStaffByDepartment: builder.query<StaffsResponse, string>({
      query: department => `${PORTAL_BASE_PATH}/staff/department/${department}`,
      providesTags: (result, error, department) => [{ type: 'Staff', id: `DEPT_${department}` }],
    }),

    // Create new staff
    createStaff: builder.mutation<
      { payload: Staff; message: string; status: number },
      StaffFormData
    >({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/staff`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Staff', id: 'LIST' },
        { type: 'Staff', id: 'STATS' },
        { type: 'Staff', id: 'ACTIVE' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update staff
    updateStaff: builder.mutation<
      { payload: Staff; message: string; status: number },
      { staffId: string; data: Partial<StaffFormData> }
    >({
      query: ({ staffId, data }) => ({
        url: `${PORTAL_BASE_PATH}/staff/${staffId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: 'LIST' },
        { type: 'Staff', id: 'STATS' },
        { type: 'Staff', id: 'ACTIVE' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Update staff status
    updateStaffStatus: builder.mutation<
      { message: string; status: number },
      { staffId: string; status: StaffStatus }
    >({
      query: ({ staffId, status }) => ({
        url: `${PORTAL_BASE_PATH}/staff/${staffId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: 'LIST' },
        { type: 'Staff', id: 'STATS' },
        { type: 'Staff', id: 'ACTIVE' },
      ],
    }),

    // Upload staff avatar
    uploadStaffAvatar: builder.mutation<
      { payload: { avatarUrl: string }; message: string; status: number },
      { staffId: string; file: string }
    >({
      query: ({ staffId, file }) => ({
        url: `${PORTAL_BASE_PATH}/staff/${staffId}/avatar`,
        method: 'POST',
        body: { file },
      }),
      invalidatesTags: (result, error, { staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: 'LIST' },
      ],
    }),

    // Grant portal access
    grantPortalAccess: builder.mutation<
      { message: string; status: number },
      { staffId: string; email: string; role?: string }
    >({
      query: ({ staffId, email, role }) => ({
        url: `${PORTAL_BASE_PATH}/staff/${staffId}/grant-access`,
        method: 'POST',
        body: { email, role },
      }),
      invalidatesTags: (result, error, { staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: 'LIST' },
      ],
    }),

    // Revoke portal access
    revokePortalAccess: builder.mutation<{ message: string; status: number }, string>({
      query: staffId => ({
        url: `${PORTAL_BASE_PATH}/staff/${staffId}/revoke-access`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, staffId) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: 'LIST' },
      ],
    }),

    // Terminate staff
    terminateStaff: builder.mutation<
      { message: string; status: number },
      { staffId: string; terminationDate: string; reason?: string }
    >({
      query: ({ staffId, terminationDate, reason }) => ({
        url: `${PORTAL_BASE_PATH}/staff/${staffId}/terminate`,
        method: 'PATCH',
        body: { terminationDate, reason },
      }),
      invalidatesTags: (result, error, { staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: 'LIST' },
        { type: 'Staff', id: 'STATS' },
        { type: 'Staff', id: 'ACTIVE' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    // Delete staff
    deleteStaff: builder.mutation<{ message: string; status: number }, string>({
      query: staffId => ({
        url: `${PORTAL_BASE_PATH}/staff/${staffId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, staffId) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: 'LIST' },
        { type: 'Staff', id: 'STATS' },
        { type: 'Staff', id: 'ACTIVE' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useGetStaffQuery,
  useLazyGetStaffQuery,
  useGetStaffByIdQuery,
  useLazyGetStaffByIdQuery,
  useGetStaffStatsQuery,
  useGetActiveStaffQuery,
  useGetStaffByDepartmentQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useUpdateStaffStatusMutation,
  useUploadStaffAvatarMutation,
  useGrantPortalAccessMutation,
  useRevokePortalAccessMutation,
  useTerminateStaffMutation,
  useDeleteStaffMutation,
} = staffApi
