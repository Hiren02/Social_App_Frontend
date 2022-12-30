import { ReactChild, ReactFragment, ReactPortal, ReactNode } from 'react'
import { toast as reactToastify, ToastContentProps } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ToastOptions = {
  position: any
  autoClose: any
  hideProgressBar: boolean
  closeOnClick: boolean
  draggable: boolean
}

const options: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: false,
}
  
export default {
  success(text: string) {
    reactToastify.success(text, options)
  },

  info(text: string) {
    reactToastify.info(text, options)
  },

  error(text: string) {
    reactToastify.error(text, options)
  },

  warning(text: string) {
    reactToastify.warning(text, options)
  },
}
