import { useRef, useState } from 'react'
import QRScanner from '../../components/QRScanner'
import ticketsApi from '../../apis/tickets.api'
import { scanTicket as scanTicketSchema } from '../../utils/rules'
import { useNavigate } from 'react-router-dom'

export default function ScanTicketPage() {
  const lastQR = useRef<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [active, setActive] = useState(true)

  const navigate = useNavigate()

  const handleScan = async (text: string | null) => {
    if (!text) return

    const trimmed = text.trim()
    if (!trimmed) return

    // Prevent repeated scans + block while API is running
    if (lastQR.current === trimmed || loading) return

    // Validate with yup schema
    try {
      await scanTicketSchema.validate(
        { qr_code_token: trimmed },
        { abortEarly: false }
      )
    } catch {
      setError('Invalid QR code')
      return
    }

    lastQR.current = trimmed
    setActive(false)
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await ticketsApi.scanTicket(trimmed)

      const ticket = res.data.result.ticket

      setMessage('Ticket scanned successfully')
      navigate(`/tickets/${ticket.id}`)
      
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to scan the ticket'
      setError(msg)

      // Allow scanning again after failure
      lastQR.current = null
      setLoading(false)
    }
  }

  return (
    <div className='p-4 space-y-4'>
      <QRScanner onScan={handleScan} />

      {loading && <p>Checking ticket…</p>}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {message && <p className="text-green-600 text-sm">{message}</p>}
    </div>
  )
}

