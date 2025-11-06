'use client'
import React, { useState } from 'react'
import { InventoryItem, InventoryLog, LogType, StaffMember } from '../types'
import { PencilIcon, TrashIcon, XIcon, PlusIcon } from './Icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setItems, setLogs } from '@/store/slices/inventorySlice'

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<'items' | 'log'>('items')
  const { items, logs } = useAppSelector(state => state.inventory)

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Inventory Management</h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          Track stock levels and item movements.
        </p>
      </div>

      <div className='border-b border-gray-200 dark:border-gray-700'>
        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
          <button
            onClick={() => setActiveTab('items')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'items' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Stock Items
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'log' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Movement Log
          </button>
        </nav>
      </div>

      {activeTab === 'items' && <StockItemsView />}
      {activeTab === 'log' && <MovementLogView logs={logs} />}
    </div>
  )
}

const StockItemsView = () => {
  const { items, logs } = useAppSelector(state => state.inventory)
  const dispatch = useAppDispatch()
  const addLogEntry = (log: InventoryLog) => {
    dispatch(setLogs([...logs, log]))
  }
  const [isItemModalOpen, setItemModalOpen] = useState(false)
  const [isMovementModalOpen, setMovementModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [movingItem, setMovingItem] = useState<InventoryItem | null>(null)
  const [movementType, setMovementType] = useState<LogType>('Checkout')

  const handleSaveItem = (item: InventoryItem) => {
    if (editingItem) {
      setItems(items.map(i => (i.id === item.id ? item : i)))
    } else {
      setItems([{ ...item, id: `item-${Date.now()}` }, ...items])
    }
    setItemModalOpen(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure? Deleting an item is permanent.')) {
      setItems(items.filter(i => i.id !== itemId))
    }
  }

  const openMovementModal = (item: InventoryItem, type: LogType) => {
    setMovingItem(item)
    setMovementType(type)
    setMovementModalOpen(true)
  }

  const handleSaveMovement = (log: Omit<InventoryLog, 'id' | 'itemDescription'>) => {
    const item = items.find(i => i.id === log.itemId)
    if (!item) return

    const newQuantity =
      log.type === 'Checkout' ? item.quantity - log.quantity : item.quantity + log.quantity
    if (newQuantity < 0) {
      alert('Checkout quantity cannot exceed available stock.')
      return
    }

    setItems(items.map(i => (i.id === log.itemId ? { ...i, quantity: newQuantity } : i)))
    addLogEntry({
      ...log,
      id: `log-${Date.now()}`,
      itemDescription: item.description,
    })
    setMovementModalOpen(false)
    setMovingItem(null)
  }

  return (
    <div>
      <div className='flex justify-end mb-4'>
        <button
          onClick={() => {
            setEditingItem(null)
            setItemModalOpen(true)
          }}
          className='bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center'
        >
          <PlusIcon className='w-5 h-5 mr-2' /> Add New Item
        </button>
      </div>
      <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>SKU</th>
              <th className='px-6 py-3'>Description</th>
              <th className='px-6 py-3 text-right'>In Stock</th>
              <th className='px-6 py-3 text-right'>Unit Cost</th>
              <th className='px-6 py-3 text-right'>Stock Value</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item.id}
                className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <td className='px-6 py-4 font-mono text-xs'>{item.sku}</td>
                <td className='px-6 py-4 font-medium'>{item.description}</td>
                <td className='px-6 py-4 text-right font-bold'>{item.quantity}</td>
                <td className='px-6 py-4 text-right'>${item.unitCost.toFixed(2)}</td>
                <td className='px-6 py-4 text-right font-semibold'>
                  ${(item.quantity * item.unitCost).toFixed(2)}
                </td>
                <td className='px-6 py-4 text-center space-x-1'>
                  <button
                    onClick={() => openMovementModal(item, 'Checkout')}
                    className='text-xs px-2 py-1 rounded bg-blue-500 text-white'
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => openMovementModal(item, 'Return')}
                    className='text-xs px-2 py-1 rounded bg-green-500 text-white'
                  >
                    Return
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item)
                      setItemModalOpen(true)
                    }}
                    className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                  >
                    <PencilIcon className='w-4 h-4 text-gray-500' />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                  >
                    <TrashIcon className='w-4 h-4 text-red-500' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isItemModalOpen && (
        <ItemModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => setItemModalOpen(false)}
        />
      )}
      {isMovementModalOpen && movingItem && (
        <MovementModal
          item={movingItem}
          type={movementType}
          onSave={handleSaveMovement}
          onClose={() => setMovementModalOpen(false)}
        />
      )}
    </div>
  )
}

const MovementLogView: React.FC<{ logs: InventoryLog[] }> = ({ logs }) => {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto'>
      <table className='w-full text-sm text-left'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th className='px-6 py-3'>Date</th>
            <th className='px-6 py-3'>Item</th>
            <th className='px-6 py-3'>Type</th>
            <th className='px-6 py-3 text-right'>Quantity</th>
            <th className='px-6 py-3'>Staff</th>
            <th className='px-6 py-3'>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr
              key={log.id}
              className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
            >
              <td className='px-6 py-4'>{log.date}</td>
              <td className='px-6 py-4 font-medium'>{log.itemDescription}</td>
              <td className='px-6 py-4'>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${log.type === 'Checkout' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                >
                  {log.type}
                </span>
              </td>
              <td className='px-6 py-4 text-right font-bold'>{log.quantity}</td>
              <td className='px-6 py-4'>{log.staffName}</td>
              <td className='px-6 py-4'>{log.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Modals for Inventory
const ItemModal: React.FC<{
  item: InventoryItem | null
  onSave: (item: InventoryItem) => void
  onClose: () => void
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>(
    item || { sku: '', description: '', quantity: 0, unitCost: 0 }
  )
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...(item || { id: '' }), ...formData })
  }
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{item ? 'Edit' : 'Add New'} Item</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            value={formData.sku}
            onChange={e => setFormData({ ...formData, sku: e.target.value })}
            placeholder='SKU'
            required
            className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <input
            type='text'
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder='Description'
            required
            className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <div className='grid grid-cols-2 gap-4'>
            <input
              type='number'
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
              placeholder='Quantity'
              required
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
            <input
              type='number'
              step='0.01'
              value={formData.unitCost}
              onChange={e => setFormData({ ...formData, unitCost: Number(e.target.value) })}
              placeholder='Unit Cost'
              required
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
          <div className='flex justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600'
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const MovementModal: React.FC<{
  item: InventoryItem
  type: LogType
  onSave: (log: Omit<InventoryLog, 'id' | 'itemDescription'>) => void
  onClose: () => void
}> = ({ item, type, onSave, onClose }) => {
  const [formData, setFormData] = useState({ quantity: 1, staffName: '', purpose: '' })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, itemId: item.id, type, date: new Date().toISOString().split('T')[0] })
  }
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>
            {type} Item: <span className='text-teal-500'>{item.description}</span>
          </h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <p className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
          Available in stock: {item.quantity}
        </p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='number'
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
            placeholder='Quantity'
            max={type === 'Checkout' ? item.quantity : undefined}
            min='1'
            required
            className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <input
            type='text'
            value={formData.staffName}
            onChange={e => setFormData({ ...formData, staffName: e.target.value })}
            placeholder='Staff Name'
            required
            className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <input
            type='text'
            value={formData.purpose}
            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
            placeholder='Purpose (e.g., Project X, Client Y)'
            required
            className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <div className='flex justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600'
            >
              Confirm {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Inventory
