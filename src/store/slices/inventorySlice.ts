import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { InventoryItem, InventoryLog } from '@/types'

// Mock Data
export const mockItems: InventoryItem[] = [
  {
    id: 'item-1',
    sku: 'HW-SRV-001',
    description: 'Dell PowerEdge R750 Server',
    quantity: 5,
    unitCost: 3500,
  },
  {
    id: 'item-2',
    sku: 'HW-LAP-003',
    description: 'Lenovo ThinkPad P1',
    quantity: 12,
    unitCost: 1800,
  },
  {
    id: 'item-3',
    sku: 'SW-OS-002',
    description: 'Windows Server 2022 License',
    quantity: 20,
    unitCost: 800,
  },
  {
    id: 'item-4',
    sku: 'HW-CAM-005',
    description: 'Hikvision IP Camera 4MP',
    quantity: 35,
    unitCost: 150,
  },
]

export const mockLogs: InventoryLog[] = [
  {
    id: 'log-1',
    itemId: 'item-2',
    itemDescription: 'Lenovo ThinkPad P1',
    staffName: 'John Doe',
    type: 'Checkout',
    quantity: 1,
    purpose: 'New client setup',
    date: '2024-07-28',
  },
  {
    id: 'log-2',
    itemId: 'item-4',
    itemDescription: 'Hikvision IP Camera 4MP',
    staffName: 'Jane Smith',
    type: 'Checkout',
    quantity: 5,
    purpose: 'Installation at Global Corp',
    date: '2024-07-25',
  },
  {
    id: 'log-3',
    itemId: 'item-2',
    itemDescription: 'Lenovo ThinkPad P1',
    staffName: 'John Doe',
    type: 'Return',
    quantity: 1,
    purpose: 'Client setup complete',
    date: '2024-07-29',
  },
]
// --- END MOCK DATA ---

interface InventoryState {
  items: InventoryItem[]
  logs: InventoryLog[]
  isLoading: boolean
  error: string | null
}

const initialState: InventoryState = {
  items: [...mockItems],
  logs: [...mockLogs],
  isLoading: false,
  error: null,
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload
      state.error = null
    },
    setLogs: (state, action: PayloadAction<InventoryLog[]>) => {
      state.logs = action.payload
      state.error = null
    },
    addItem: (state, action: PayloadAction<InventoryItem>) => {
      state.items.push(action.payload)
      state.error = null
    },
    updateItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        state.error = null
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.error = null
    },
    addLog: (state, action: PayloadAction<InventoryLog>) => {
      state.logs.push(action.payload)
      state.error = null
    },
  },
})
export const {
  setItems,
  setLogs,

  addItem,
  updateItem,
  deleteItem,
  addLog,
} = inventorySlice.actions

export default inventorySlice.reducer
