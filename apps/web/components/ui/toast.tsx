"use client"

import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => removeToast(id), toast.duration || 4500)
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => addToast({ type: 'success', title, message }), [addToast])
  const error = useCallback((title: string, message?: string) => addToast({ type: 'error', title, message }), [addToast])
  const info = useCallback((title: string, message?: string) => addToast({ type: 'info', title, message }), [addToast])
  const warning = useCallback((title: string, message?: string) => addToast({ type: 'warning', title, message }), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  }

  const accent = {
    success: '#4D9E6A',
    error: '#C0514A',
    warning: '#D4A853',
    info: '#9E9880',
  }

  return (
    <div
      className="animate-in slide-in-from-right rounded-md border bg-[#18181F] p-4 shadow-xl duration-300"
      style={{ borderColor: '#2A2A38', borderLeft: `3px solid ${accent[toast.type]}` }}
    >
      <div className="flex items-start gap-3">
        <div style={{ color: accent[toast.type] }}>{icons[toast.type]}</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#EDE9DC]">{toast.title}</h3>
          {toast.message && <p className="mt-1 text-sm text-[#9E9880]">{toast.message}</p>}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-[#9E9880] opacity-60 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
