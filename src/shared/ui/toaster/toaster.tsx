import { ToastContainer } from 'react-toastify'

export function Toaster() {
  return (
    <ToastContainer
      closeOnClick
      hideProgressBar
      newestOnTop
      autoClose={5000}
      pauseOnHover={false}
      position="bottom-center"
      theme="dark"
      toastClassName="strata-toast"
    />
  )
}
