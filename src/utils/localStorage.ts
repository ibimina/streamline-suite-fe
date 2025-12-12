// localStorage utilities for state persistence and app preferences
export class LocalStorageManager {
  private static readonly STORAGE_KEYS = {
    // Authentication persistence
    AUTH_TOKEN: 'streamline_auth_token',
    REFRESH_TOKEN: 'streamline_refresh_token',
    USER_SESSION: 'streamline_user_session',
    EXPIRES_IN: 'streamline_token_expiration',

    // User preferences (not in Redux)
    THEME_PREFERENCE: 'streamline_theme',
    LANGUAGE_PREFERENCE: 'streamline_language',
    SIDEBAR_COLLAPSED: 'streamline_sidebar_collapsed',
    TABLE_PREFERENCES: 'streamline_table_preferences',
    NOTIFICATION_SETTINGS: 'streamline_notification_settings',

    // Form data persistence
    DRAFT_INVOICE: 'streamline_draft_invoice',
    DRAFT_QUOTATION: 'streamline_draft_quotation',
    UNSAVED_FORMS: 'streamline_unsaved_forms',

    // App state
    LAST_VISITED_PAGE: 'streamline_last_page',
    ONBOARDING_COMPLETED: 'streamline_onboarding_done',
    TOUR_COMPLETED: 'streamline_tour_completed',

    // Cache with expiration
    COMPANIES_CACHE: 'streamline_companies_cache',
    PRODUCTS_CACHE: 'streamline_products_cache',
  } as const

  // Generic localStorage helpers
  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
      })
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error)
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage?.getItem(key)
      if (!item) return null

      const parsed = JSON.parse(item)
      return parsed.data || parsed // Handle both new and old formats
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error)
      return null
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error)
    }
  }

  static clear(): void {
    try {
      // Only clear our app's keys, not all localStorage
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  // Authentication tokens
  static setAuthToken(token: string): void {
    this.setItem(this.STORAGE_KEYS.AUTH_TOKEN, token)
  }

  static getAuthToken(): string | null {
    return this.getItem<string>(this.STORAGE_KEYS.AUTH_TOKEN)
  }

  static setUserSession(user: any): void {
    this.setItem(this.STORAGE_KEYS.USER_SESSION, user)
  }

  static getUserSession(): any | null {
    return this.getItem(this.STORAGE_KEYS.USER_SESSION)
  }

  static setExpiresIn(expirationTime: number): void {
    this.setItem(this.STORAGE_KEYS.EXPIRES_IN, expirationTime)
  }

  static getExpiresIn(): number | null {
    return this.getItem<number>(this.STORAGE_KEYS.EXPIRES_IN)
  }

  static setRefreshToken(token: string): void {
    this.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, token)
  }

  static getRefreshToken(): string | null {
    return this.getItem<string>(this.STORAGE_KEYS.REFRESH_TOKEN)
  }

  static clearAuthTokens(): void {
    this.removeItem(this.STORAGE_KEYS.AUTH_TOKEN)
    this.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN)
    this.removeItem(this.STORAGE_KEYS.USER_SESSION)
  }

  // User preferences
  static setThemePreference(theme: 'light' | 'dark' | 'system'): void {
    this.setItem(this.STORAGE_KEYS.THEME_PREFERENCE, theme)
  }

  static getThemePreference(): 'light' | 'dark' | 'system' | null {
    return this.getItem<'light' | 'dark' | 'system'>(this.STORAGE_KEYS.THEME_PREFERENCE)
  }

  static setSidebarCollapsed(collapsed: boolean): void {
    this.setItem(this.STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed)
  }

  static getSidebarCollapsed(): boolean {
    const collapsed = this.getItem<boolean>(this.STORAGE_KEYS.SIDEBAR_COLLAPSED)
    return collapsed ?? false
  }

  // Form drafts
  static saveDraftInvoice(invoiceData: any): void {
    this.setItem(this.STORAGE_KEYS.DRAFT_INVOICE, {
      data: invoiceData,
      savedAt: new Date().toISOString(),
    })
  }

  static getDraftInvoice(): any | null {
    const draft = this.getItem<{ data: any; savedAt: string }>(this.STORAGE_KEYS.DRAFT_INVOICE)
    return draft?.data || null
  }

  static clearDraftInvoice(): void {
    this.removeItem(this.STORAGE_KEYS.DRAFT_INVOICE)
  }

  // Cache with expiration (1 hour default)
  static setCacheItem<T>(key: string, data: T, expirationHours: number = 1): void {
    const expirationTime = Date.now() + expirationHours * 60 * 60 * 1000
    this.setItem(key, {
      data,
      expiration: expirationTime,
    })
  }

  static getCacheItem<T>(key: string): T | null {
    try {
      const cached = this.getItem<{ data: T; expiration: number }>(key)

      if (!cached) return null

      if (Date.now() > cached.expiration) {
        this.removeItem(key)
        return null
      }

      return cached.data
    } catch (error) {
      console.error(`Error getting cached item ${key}:`, error)
      return null
    }
  }

  // Table preferences
  static setTablePreferences(tableId: string, preferences: any): void {
    const allPreferences =
      this.getItem<Record<string, any>>(this.STORAGE_KEYS.TABLE_PREFERENCES) || {}
    allPreferences[tableId] = preferences
    this.setItem(this.STORAGE_KEYS.TABLE_PREFERENCES, allPreferences)
  }

  static getTablePreferences(tableId: string): any | null {
    const allPreferences =
      this.getItem<Record<string, any>>(this.STORAGE_KEYS.TABLE_PREFERENCES) || {}
    return allPreferences[tableId] || null
  }

  // Onboarding and tours
  static setOnboardingCompleted(): void {
    this.setItem(this.STORAGE_KEYS.ONBOARDING_COMPLETED, true)
  }

  static isOnboardingCompleted(): boolean {
    return this.getItem<boolean>(this.STORAGE_KEYS.ONBOARDING_COMPLETED) || false
  }

  static setLastVisitedPage(path: string): void {
    this.setItem(this.STORAGE_KEYS.LAST_VISITED_PAGE, path)
  }

  static getLastVisitedPage(): string | null {
    return this.getItem<string>(this.STORAGE_KEYS.LAST_VISITED_PAGE)
  }

  // Check if localStorage is available
  static isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (error) {
      return false
    }
  }
}
