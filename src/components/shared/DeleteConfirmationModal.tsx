'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteConfirmationModalProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  itemName?: string
  itemType?: string
  isLoading?: boolean
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  itemName,
  itemType = 'item',
  isLoading = false,
}) => {
  const title = itemName ? `Delete ${itemType}?` : 'Confirm Deletion'
  const description = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.'

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onCancel()}>
      <DialogContent className='sm:max-w-106.5'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive-light'>
              <AlertTriangle className='h-5 w-5 text-destructive' />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className='mt-1'>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className='mt-4'>
          <Button variant='outline' onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationModal
