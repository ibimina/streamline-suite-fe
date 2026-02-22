import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocalStorageManager } from '@/utils/localStorage'

interface UIState {
  // These will be synchronized with localStorage
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  language: string

  // These stay only in Redux (session-only)
  isLoading: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: number
  }>
  modalsOpen: Record<string, boolean>
  activeTooltip: string | null
}

// Initialize state from localStorage
const getInitialState = (): UIState => {
  const savedTheme = LocalStorageManager.getThemePreference() || 'system'
  const savedSidebarCollapsed = LocalStorageManager.getSidebarCollapsed()

  return {
    theme: savedTheme,
    sidebarCollapsed: savedSidebarCollapsed,
    language: 'en', // Could also be loaded from localStorage
    isLoading: false,
    notifications: [],
    modalsOpen: {},
    activeTooltip: null,
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: getInitialState(),
  reducers: {
    // Theme management
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
      // Persist to localStorage
      LocalStorageManager.setThemePreference(action.payload)
    },

    // Sidebar management
    toggleSidebar: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed
      // Persist to localStorage
      LocalStorageManager.setSidebarCollapsed(state.sidebarCollapsed)
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
      // Persist to localStorage
      LocalStorageManager.setSidebarCollapsed(action.payload)
    },

    // Loading states (session-only, not persisted)
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Notifications (session-only)
    addNotification: (
      state,
      action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>
    ) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      state.notifications.push(notification)

      // Auto-remove after 5 seconds for success/info, 10 seconds for warnings/errors
      const timeout = ['success', 'info'].includes(notification.type) ? 5000 : 10000
      setTimeout(() => {
        // This would need to be handled by a middleware or useEffect
      }, timeout)
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },

    clearNotifications: state => {
      state.notifications = []
    },

    // Modal management (session-only)
    openModal: (state, action: PayloadAction<string>) => {
      state.modalsOpen[action.payload] = true
    },

    closeModal: (state, action: PayloadAction<string>) => {
      state.modalsOpen[action.payload] = false
    },

    closeAllModals: state => {
      state.modalsOpen = {}
    },

    // Tooltip management (session-only)
    setActiveTooltip: (state, action: PayloadAction<string | null>) => {
      state.activeTooltip = action.payload
    },

    // Language (could be persisted)
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
      // Could persist to localStorage if needed
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setActiveTooltip,
  setLanguage,
} = uiSlice.actions

export default uiSlice.reducer
