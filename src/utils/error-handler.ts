import { toast } from 'react-toastify'

const handleError = (error: any) => {
  const errResp = error ? error?.data : {}
  if (!errResp) {
    toast.error('Network Error. Please check your network connection')
    return
  }
  if (Object.keys(errResp).length === 0) {
    return
  }
  const { statusCode } = errResp.data
  if (statusCode === 401) {
    return toast.error('Invalid login details entered')
  }
  if (statusCode === 405) {
    return toast.error('Invalid Method. Please check and try again')
  }
  if (statusCode === 429) {
    //this is supposed to handle the error for too many request
    return
  }
  if (statusCode === 502) {
    return toast.error('Bad gateway')
  }
  if (statusCode === 500) {
    return toast.error('Something went wrong, please cross-check details and try again')
  }
  const { message } = errResp.data
  const checkIfArray = Array.isArray(message)

  if (!checkIfArray) {
    return toast.error(message)
  }

  if (process.env.NODE_ENV === 'development') {
    if (!errResp.success && errResp && checkIfArray && message.length > 0) {
      message.map(item => {
        return toast.error(item, { closeOnClick: true })
      })
    } else {
      const err = error.response
        ? error.response.data.error
        : 'Something went wrong, please cross-check details and try again.'

      toast.error(err)
    }
  } else {
    return toast.error('Something went wrong, please cross-check details and try again.')
  }
}

export default handleError
