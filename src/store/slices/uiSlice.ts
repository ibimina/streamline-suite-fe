import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  currentPage: string;
  isLoading: boolean;
  notifications: Notification[];
  modal: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };
  isMobileSidebarOpen: boolean;
  isDesktopSidebarCollapsed: boolean;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  timestamp: number;
  duration?: number;
}

// Load theme from localStorage for persistence
const loadThemeFromStorage = (): Theme => {
  if (typeof window === "undefined") return "system";

  try {
    const storedTheme = localStorage.getItem("theme") as Theme;
    return storedTheme || "system";
  } catch (error) {
    console.error("Failed to load theme from localStorage", error);
    return "system";
  }
};

const initialState: UIState = {
  theme: loadThemeFromStorage(),
  sidebarOpen: true,
  currentPage: "dashboard",
  isLoading: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  isMobileSidebarOpen: false,
  isDesktopSidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;

      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("theme", action.payload);
        } catch (error) {
          console.error("Failed to save theme to localStorage", error);
        }
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDesktopSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isDesktopSidebarCollapsed = action.payload;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "timestamp">>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.data = action.payload.data || null;
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.data = null;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setCurrentPage,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setMobileSidebarOpen,
  setDesktopSidebarCollapsed,
} = uiSlice.actions;

export default uiSlice.reducer;
