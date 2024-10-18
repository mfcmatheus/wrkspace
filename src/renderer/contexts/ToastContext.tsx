import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

export interface props {
  children: React.ReactNode
}

export interface IToastContext {
  showError: (message: string) => void
  showSuccess: (message: string) => void
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
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark',
        transition: Zoom,
        closeButton: false,
        className: '!bg-[#1b1b1d]',
        bodyClassName: '!text-xs !font-thin',
      }),
    []
  )

  const showSuccess = useCallback(
    (message: string) =>
      toast.success(message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark',
        transition: Zoom,
        closeButton: false,
        className: '!bg-background border border-border',
        bodyClassName: '!text-xs !font-thin',
      }),
    []
  )

  const providerValue = useMemo(
    () => ({
      showError,
      showSuccess,
    }),
    [showError, showSuccess]
  )

  return (
    <ToastContext.Provider value={providerValue}>
      {children}
      <ToastContainer style={{ marginTop: '35px' }} />
    </ToastContext.Provider>
  )
}

export default { ToastProvider, ToastContext, useToast }
