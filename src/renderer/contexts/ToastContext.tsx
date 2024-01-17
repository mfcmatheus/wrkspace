import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

export interface props {
  children: React.ReactNode
}

export interface IToastContext {
  showError: (message: string) => void
}

export const ToastContext = createContext<IToastContext>({} as IToastContext)

export const useToast = () => {
  const context = useContext<IToastContext>(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a Toast provider')
  }

  return context
}

export function ToastProvider(props: props) {
  const { children } = props

  const showError = useCallback(
    (message: string) =>
      toast.error(message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark',
        transition: Zoom,
        closeButton: false,
        className: '!bg-[#181818]',
        bodyClassName: '!text-sm !font-thin',
      }),
    []
  )

  const providerValue = useMemo(
    () => ({
      showError,
    }),
    [showError]
  )

  return (
    <ToastContext.Provider value={providerValue}>
      {children}
      <ToastContainer style={{ marginTop: '35px' }} />
    </ToastContext.Provider>
  )
}

export default { ToastProvider, ToastContext, useToast }
