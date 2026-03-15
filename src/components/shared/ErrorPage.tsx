const ErrorPage = ({ errorMessage, refetch }: { errorMessage: string; refetch: () => void }) => {
  return (
    <div className='text-center py-12'>
      <p className='text-red-500 mb-4'>{errorMessage}</p>
      <button
        onClick={() => refetch()}
        className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary'
      >
        Retry
      </button>
    </div>
  )
}
export default ErrorPage
