// ScanTicket.tsx
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRScanner from '../../components/QRScanner'
import ticketsApi from '../../apis/tickets.api'

export default function ScanTicketPage() {
  const lastQR = useRef<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [active, setActive] = useState(true)

  const navigate = useNavigate()

  const handleScan = async (text: string | null) => {
    if (!text) return

    const trimmed = text.trim()
    if (!trimmed) return

    // Prevent repeated scans + block while API is running
    if (lastQR.current === trimmed || loading) return

    lastQR.current = trimmed
    setActive(false)
    setLoading(true)
    setError(null)
    setStatus('Checking ticket...')

    try {
      const res = await ticketsApi.scanTicket(trimmed)
      const ticket = res.data.result.ticket

      setStatus('Ticket valid. Redirecting...')
      // Page will unmount after navigation, no need to re-activate scanner
      navigate(`/tickets/${ticket.id}`)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to scan ticket. Please try again.'

      setError(msg)
      setStatus(null)

      // Allow scanning again after failure
      lastQR.current = null
      setLoading(false)
      setActive(true)
    }
  }

  const handleScannerError = (err: unknown) => {
    console.error('Scanner error', err)

    // Normalize to string
    const rawMsg =
      typeof err === 'string'
        ? err
        : (err as any)?.message || (err as any)?.name || ''

    const msg = String(rawMsg || '').trim()
    const lower = msg.toLowerCase()

    // This is a normal "no QR in this frame" case -> ignore
    if (lower.includes('no qr code found')) {
      return
    }

    // Real error handling
    if (msg === 'NotAllowedError' || lower.includes('notallowederror')) {
      setError(
        'Camera access was blocked by the browser. Check site permissions in the address bar.'
      )
      return
    }

    if (lower.includes('notfounderror')) {
      setError('No camera device was found. Check if a camera is connected.')
      return
    }

    if (lower.includes('notreadableerror')) {
      setError('Camera is already in use by another application or tab.')
      return
    }

    if (lower.includes('overconstrainederror')) {
      setError(
        'Requested camera constraints are not available on this device (e.g., back camera).'
      )
      return
    }

    // Fallback
    setError(msg ? `Camera error: ${msg}` : 'Unknown camera error occurred.')
  }

  return (
    <div className='min-h-[calc(100vh-80px)] flex items-center justify-center px-4'>
      <div className='w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 space-y-6'>
        {/* Header */}
        <div className='space-y-1'>
          <h1 className='text-xl font-semibold text-slate-900 dark:text-slate-50'>
            Scan QR Ticket
          </h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Point the camera at a valid QR ticket to verify it. You can also upload a QR
            image if needed.
          </p>
        </div>

        {/* Scanner */}
        <div className='rounded-xl overflow-hidden border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40 p-3'>
          <QRScanner
            onScan={handleScan}
            onError={handleScannerError}
            active={active && !loading}
            allowUpload
          />
        </div>

        {/* Status / Errors / Hints */}
        <div className='space-y-2'>
          {loading && (
            <div className='text-sm text-slate-600 dark:text-slate-300'>
              <span className='inline-flex items-center gap-2'>
                <span className='h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin' />
                Checking ticket...
              </span>
            </div>
          )}

          {status && !loading && !error && (
            <p className='text-sm text-emerald-600 dark:text-emerald-400'>
              {status}
            </p>
          )}

          {error && (
            <div className='text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2'>
              {error}
            </div>
          )}

          {!loading && !error && !status && (
            <p className='text-xs text-slate-400'>
              Tip: Make sure the QR code is well lit, fully visible in the frame, and
              not blurred. You can also upload a screenshot of the QR code.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
  