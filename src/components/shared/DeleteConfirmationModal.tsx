const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 overflow-y-auto flex justify-center items-start sm:items-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm'>
        <h3 className='text-lg font-bold mb-2'>Confirm Deletion</h3>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>
          Are you sure? This action cannot be undone.
        </p>
        <div className='flex justify-end'>
          <button
            onClick={onCancel}
            className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
export default DeleteConfirmationModal
