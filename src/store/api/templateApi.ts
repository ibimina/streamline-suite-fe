import { baseApi } from './baseApi'
import { PORTAL_BASE_PATH } from '@/contants'

// Request types
export interface UploadTemplateRequest {
  file: string // base64 data URI
  imagePath: string
  resourceType: string
  name: string
  description: string
}

// Template type
export interface Template {
  _id: string
  uniqueId: string
  name: string
  description?: string
  imageUrl: string
  isActive: boolean
  publicId: string
  createdAt: string
  updatedAt: string
}

// Response types
interface UploadTemplateResponse {
  payload: {
    secure_url: string
    public_id: string
    template: {
      _id: string
      uniqueId: string
      name: string
      description?: string
      imageUrl: string
    }
  }
  message: string
  status: number
}

interface GetTemplatesResponse {
  payload: Template[]
  message: string
  status: number
}

interface DeleteTemplateResponse {
  message: string
}

// Template API endpoints using RTK Query
export const templateApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Upload a new template
    uploadTemplate: builder.mutation<UploadTemplateResponse, UploadTemplateRequest>({
      query: data => ({
        url: `${PORTAL_BASE_PATH}/templates`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Template', id: 'LIST' }],
    }),

    // Get all templates for the account
    getTemplates: builder.query<GetTemplatesResponse, void>({
      query: () => `${PORTAL_BASE_PATH}/templates`,
      providesTags: result =>
        result
          ? [
              ...result.payload.map(({ _id }) => ({
                type: 'Template' as const,
                id: _id,
              })),
              { type: 'Template', id: 'LIST' },
            ]
          : [{ type: 'Template', id: 'LIST' }],
    }),

    // Delete a template
    deleteTemplate: builder.mutation<DeleteTemplateResponse, string>({
      query: templateId => ({
        url: `${PORTAL_BASE_PATH}/templates/${templateId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, templateId) => [
        { type: 'Template', id: templateId },
        { type: 'Template', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const {
  useUploadTemplateMutation,
  useGetTemplatesQuery,
  useLazyGetTemplatesQuery,
  useDeleteTemplateMutation,
} = templateApi
